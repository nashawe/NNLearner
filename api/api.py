from fastapi import FastAPI, Request, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import asyncio


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# now continue importing after CORS is applied
from .train_runner import run_training_from_api
from .predict_runner import run_prediction_from_api

from pydantic import BaseModel
from typing import List, Union, Optional
import uuid
import os
from models.network import NeuralNetwork

losses_store = {}          # training_id → [ {epoch, loss}, … ]
queues = {}                # training_id → asyncio.Queue()

# 1. Define the structure of the expected input using a Pydantic mode
class TrainRequest(BaseModel):
    input_size: int
    output_size: int
    hidden_size: int
    num_layers: int
    dropout: float
    optimizer_choice: int
    mode_id: int
    batch_size: Optional[int] = None
    init_id: int
    learn_rate: float
    epochs: int
    data: List[List[float]]
    labels: List[Union[float, List[float]]]
    save_after_train: Optional[bool] = False
    filename: Optional[str] = "latest_model.npz"
    use_scheduler: Optional[bool] = False

class PredictRequest(BaseModel):
    model_path: str
    test_data: List[List[float]]

# 2. Route for training
@app.post("/train")
def train_model(request: TrainRequest):
    training_id = str(uuid.uuid4())  # unique session ID
    result = run_training_from_api(
        input_size=request.input_size,
        output_size=request.output_size,
        hidden_size=request.hidden_size,
        num_layers=request.num_layers,
        dropout=request.dropout,
        optimizer_choice=request.optimizer_choice,
        mode_id=request.mode_id,
        batch_size=request.batch_size,
        learn_rate=request.learn_rate,
        init_id=request.init_id,
        epochs=request.epochs,
        data=request.data,
        labels=request.labels,
        save_after_train=request.save_after_train,
        filename=request.filename,
        use_scheduler=request.use_scheduler,
    )
    return {
        "training_id": training_id,
        **result
    }

@app.post("/predict")
def predict(request: PredictRequest):
    try:
        result = run_prediction_from_api(
            model_path = request.model_path,
            test_data = request.test_data
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.get("/models")
def list_saved_models():
    try:
        models_dir = "saved_models"
        model_files = [f for f in os.listdir(models_dir) if f.endswith(".npz")]
        return {"models": model_files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not list models: {str(e)}")

@app.get("/train_status")
def get_train_status(training_id: str):
    return {
        "training_id": training_id,
        "status": "complete",  # Always returns complete for now
        "message": "Training has finished. (Dummy response)"
    }

@app.exception_handler(Exception)
async def handle_general_error(request: Request, exc: Exception):
    print("❌ Backend error:", repr(exc))
    return JSONResponse(
        status_code=500,
        content={
            "error": "Something went wrong.",
            "details": str(exc)
        }
    )

@app.post("/train")
def train_model(req: TrainRequest, bg: BackgroundTasks):
    tid = str(uuid.uuid4())
    losses_store[tid] = []
    queues[tid] = asyncio.Queue()

    def cb(epoch, loss):
        pkt = {"epoch": epoch, "loss": round(loss,6)}
        losses_store[tid].append(pkt)
        # enqueue for WS
        asyncio.create_task(queues[tid].put(pkt))

    bg.add_task(
        run_training_from_api,
        req.input_size, req.output_size, req.hidden_size, req.num_layers,
        req.dropout, req.optimizer_choice, req.mode_id, req.batch_size,
        req.learn_rate, req.epochs, req.init_id, req.data, req.labels,
        req.save_after_train, req.filename, req.use_scheduler,
        on_epoch_end=cb
    )
    return {"training_id": tid}

@app.get("/loss_history")
def get_history(training_id: str):
    return losses_store.get(training_id, [])

@app.websocket("/ws/{training_id}")
async def loss_ws(ws: WebSocket, training_id: str):
    await ws.accept()
    if training_id not in queues:
        await ws.close()
        return
    # send existing
    for pkt in losses_store[training_id]:
        await ws.send_json(pkt)
    # stream new
    try:
        while True:
            pkt = await queues[training_id].get()
            await ws.send_json(pkt)
    except WebSocketDisconnect:
        pass
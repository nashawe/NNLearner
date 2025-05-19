from fastapi import FastAPI, Request, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or set to frontend domain
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

training_history_store: dict[str, dict] = {}


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

@app.post("/train")
def train_model(request: TrainRequest):
    print("TRAINING ENDPOINT HIT")

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
        "loss": result["loss_history"],
        "accuracy": result["acc_history"],
        "learning_rate": result["lr_history"],
        "final_metrics": {
            "loss": result["loss_history"][-1],
            "accuracy": result["acc_history"][-1],
            "learning_rate": result["lr_history"][-1],
        }
    }

    
# 3. Route for training dashboard
@app.get("/training-history/{training_id}")
def get_training_history(training_id: str):
    if training_id not in training_history_store:
        raise HTTPException(status_code=404, detail="Training history not found")

    history = training_history_store[training_id]

    return {
        "loss": history["loss"],                     # list
        "accuracy": history["accuracy"],             # list
        "learning_rate": history["learning_rate"],   # list
        "final_metrics": history["final_metrics"]    # dict
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



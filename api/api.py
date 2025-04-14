from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List, Union, Optional
from api.train_runner import run_training_from_api
from api.predict_runner import run_prediction_from_api
import os
import uuid
from fastapi.responses import JSONResponse

app = FastAPI() #defines the API app

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
    learning_rate: float
    epochs: int
    data: List[List[float]]
    labels: List[Union[float, List[float]]]
    save_after_train: Optional[bool] = False
    filename: Optional[str] = "latest_model.npz"

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
        learning_rate=request.learning_rate,
        epochs=request.epochs,
        data=request.data,
        labels=request.labels,
        save_after_train=request.save_after_train,
        filename=request.filename
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
    return JSONResponse(
        status_code=500,
        content={
            "error": "Something went wrong.",
            "details": str(exc)
        }
    )
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Union, Optional
from api.train_runner import run_training_from_api
from api.predict_runner import run_prediction_from_api
import os

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

    return result

@app.post("/predict")
def predict(request: PredictRequest):
    result = run_prediction_from_api(
        model_path = request.model_path,
        test_data = request.test_data
    )
    return result

@app.get("/models")
def list_saved_models():
    models_dir = "saved_models"
    model_files = [f for f in os.listdir(models_dir) if f.endswith(".npz")]
    return {"models": model_files}

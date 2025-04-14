from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Union
from api.train_runner import run_training_from_api

app = FastAPI() #defines the API app

# 1. Define the structure of the expected input using a Pydantic model
class TrainRequest(BaseModel):
    input_size: int  # Size of the input data
    output_size: int  # Size of the output data
    hidden_size: int  # Size of the hidden layers in the neural network
    num_layers: int  # Number of layers in the neural network
    dropout: float  # Dropout rate for regularization
    optimizer_choice: int  # Choice of optimizer for training
    mode_id: int  # Mode ID for the neural network
    batch_size: Union[int, None] = None  # Batch size for training (optional)
    learning_rate: float  # Learning rate for training
    epochs: int  # Number of training epochs
    data: List[List[float]]  # Input data for training
    labels: List[Union[float, List[float]]]  # Output labels for training

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
    )
    return result
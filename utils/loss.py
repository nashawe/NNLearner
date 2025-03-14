import numpy as np

def mse_loss(y_true, y_pred):
    return ((y_true - y_pred) ** 2).mean()

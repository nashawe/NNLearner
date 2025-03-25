import numpy as np

def mse_loss(y_true, y_pred):
    return ((y_true - y_pred) ** 2).mean()

def bce_loss(y_true, y_pred, eps=1e-12):
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))
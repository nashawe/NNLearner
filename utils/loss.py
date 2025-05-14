import numpy as np

def mse_loss(y_true, y_pred):
    return ((y_true - y_pred) ** 2).mean()

def bce_loss(y_true, y_pred, eps=1e-12):
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))

def cross_entropy(y_true, y_pred, eps=1e-12):
    # y_true, y_pred: shape (batch_size, n_classes)
    y_pred = np.clip(y_pred, eps, 1 - eps)
    # sum over classes, mean over batch
    ce = -np.sum(y_true * np.log(y_pred), axis=1)
    return np.mean(ce)

def cross_entropy_grad(y_pred, y_true):
    # derivative of CE w.r.t logits after softmax: (y_pred - y_true)/batch_size
    batch_size = y_true.shape[0]
    return (y_pred - y_true) / batch_size


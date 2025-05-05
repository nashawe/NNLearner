from utils.activation import sigmoid, deriv_sig, tanh, deriv_tanh, relu, deriv_relu, softmax
from utils.loss import mse_loss, bce_loss, cross_entropy, cross_entropy_grad
import numpy as np

def clipped_bce_grad(y_pred, y_true, eps=1e-7):
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return (y_pred - y_true) / (y_pred * (1 - y_pred))

MODES = {
    1: {
        "hidden_activation": sigmoid,
        "hidden_deriv": deriv_sig,
        "output_activation": sigmoid,
        "output_deriv": deriv_sig,
        "loss": mse_loss,
        "loss_grad": lambda y_pred, y_true: 2 * (y_pred - y_true),
        "normalize": True,
    },
    2: {
        "hidden_activation": sigmoid,
        "hidden_deriv": deriv_sig,
        "output_activation": sigmoid,
        "output_deriv": deriv_sig,
        "loss": bce_loss,
        "loss_grad": clipped_bce_grad,
        "normalize": True,
    },
    3: {
        "hidden_activation": tanh,
        "hidden_deriv": deriv_tanh,
        "output_activation": tanh,
        "output_deriv": deriv_tanh,
        "loss": mse_loss,
        "loss_grad": lambda y_pred, y_true: 2 * (y_pred - y_true),
        "normalize": False,
    },
    4: {
        "hidden_activation": relu,
        "hidden_deriv": deriv_relu,
        "output_activation": sigmoid,
        "output_deriv": deriv_sig,
        "loss": bce_loss,
        "loss_grad": clipped_bce_grad,
        "normalize": False,
    },
    5: {
    "hidden_activation": relu,  
    "hidden_deriv": deriv_relu,
    "output_activation": softmax,
    "output_deriv": None, 
    "loss": cross_entropy,
    "loss_grad": cross_entropy_grad,
    "normalize": False,
    }
}

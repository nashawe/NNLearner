import numpy as np

def sigmoid(x):
    x = np.clip(x, -500, 500)  # Prevent overflow
    return 1 / (1 + np.exp(-x))

def deriv_sig(x):
    sig_x = sigmoid(x)  # Ensure x is passed through sigmoid first
    return sig_x * (1 - sig_x)



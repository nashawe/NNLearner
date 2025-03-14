import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def deriv_sig(activated):
    # Assumes the input is already the output of the sigmoid function.
    return activated * (1 - activated)

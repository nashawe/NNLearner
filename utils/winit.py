import numpy as np

def random_init(n_in):
    return np.random.randn(n_in)

def xavier_init(n_in):
    limit = np.sqrt(1 / n_in)
    return np.random.uniform(-limit, limit, n_in)

def he_init(n_in):
    std = np.sqrt(2 / n_in)
    return np.random.randn(n_in) * std
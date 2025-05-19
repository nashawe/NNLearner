import numpy as np

def he_init(fan_in, fan_out):
    return np.random.randn(fan_in, fan_out) * np.sqrt(2. / fan_in)

def xavier_init(fan_in, fan_out):
    return np.random.randn(fan_in, fan_out) * np.sqrt(1. / fan_in)

def random_init(fan_in, fan_out):
    return np.random.randn(fan_in, fan_out) * 0.01
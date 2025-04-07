import numpy as np
from utils.activation import sigmoid

class Neuron:
    def __init__(self, num_inputs, init_fn):
        self.weights = init_fn(num_inputs)
        self.bias = np.random.randn()
        self.dropped = False

    def __call__(self, x):
        return sigmoid(np.dot(self.weights, x) + self.bias)


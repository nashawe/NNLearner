import numpy as np
from utils.activation import sigmoid

class Neuron:
    def __init__(self, num_inputs):
        self.weights = np.random.randn(num_inputs)
        self.bias = np.random.randn()

    def __call__(self, x):
        return sigmoid(np.dot(self.weights, x) + self.bias)


import numpy as np

class Neuron:
    def __init__(self, num_inputs):
        self.weights = np.random.randn(num_inputs)
        self.bias = np.random.randn()
    
    def __call__(self, x):
        # Compute weighted sum plus bias
        return np.dot(self.weights, x) + self.bias

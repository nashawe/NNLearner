import numpy as np

# Define the sigmoid activation function:
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# Initialize the neuron class and its variables (weights and bias):
class Neuron:
    def __init__(self, weights, bias):
        self.weights = weights
        self.bias = bias
    
    # Define the "neuron_func" method for computing the output of the neuron:
    def neuron_func(self, x): 
        # Uses np.dot to calculate dot product of inputs and weights. Adds the bias.
        total = np.dot(self.weights, x) + self.bias
        sig_val = sigmoid(total)
        return sig_val
    
# Defines the actual values used in this neuron. Weights, bias.
weights = np.array([0,1,])
bias = 4
n = Neuron(weights, bias)

# Sets the inputs that were determined. These could be any values and any number of values.
x = np.array([2,3])

class NeuralNetwork:    # Initializes the neural network object.
    def __init__(self):
        weights = np.array([0,1])   # Gives the weights in the form of an array.
        bias = 0    # No bias in this neural network.

        # Sets the three different instances of the neuron class (defined above)
        self.h1 = Neuron(weights, bias)     # One of the two hidden neurons (h1)
        self.h2 = Neuron(weights, bias)     # One of the two hidden neurons (h2)
        self.o1 = Neuron(weights, bias)     # The final output neuron (o1). Its inputs will be the outputs of h1 and h2. Check diagram.
    def feedforward(self, x):
        out_h1 = self.h1.neuron_func(x)     # Defines the output of the first hidden neuron. 
        out_h2 = self.h2.neuron_func(x)     # Defines the output of the second hidden neuron.

        out_o1 = self.o1.neuron_func(np.array([out_h1, out_h2]))    # Defines output of output neuron with out_h1 and out_h2 as the inputs.
        return out_o1   # Returns the final value we want (after original inputs are put through both the hidden neurons and the final neuron.)

network = NeuralNetwork()
x = np.array([2,3])
print(network.feedforward(x))
import numpy as np
<<<<<<< HEAD
 
 # Define the sigmoid activation function:
 def sigmoid(x):
     return 1 / (1 + np.exp(-x))
 
 # Initialize the neuron class and its variables (weights and bias):
 class Neuron:
     def __init__(self, weights, bias):
         self.weights = weights
         self.bias = bias
     
     # Define the "feedforward" method for computing the output of the neuron:
     def feedforward(self, inputs): 
         # Uses np.dot to calculate dot product of inputs and weights. Adds the bias.
         total = np.dot(self.weights, inputs) + self.bias
         sig_val = sigmoid(total)
         return round(sig_val, 4)
     
 # Defines the actual values used in this neuron. Weights, bias.
 weights = np.array([0,1,])
 bias = 4
 n = Neuron(weights, bias)
 
 # Sets the inputs that were determined. These could be any values and any number of values.
 x = np.array([2,3,])
 # Prints the final result after being passed through the sigmoid activation function.
 print(f"When the inputs are {x} and the weights are {weights}, the neuron outputs {n.feedforward(x)}.")
 
 # Final Explanation: 1) Numpy is imported so we can better do mathematical operations with arrays and equations. 2) We define the sigmoid function with x as our argument (x will be the input later on). 3) We initialize the Neuron class with its respective traits (weights, bias). 4) We define the feedforward function with the arguments (self and inputs). This will produce the dot product of the inputs and then put that value through the sigmoid function. 5) After all of that, the specific values that will be used in the neuron are defined and passed through. 6) The final line means that the final value (in range 0-1) is printed in the console. 
=======

# Define the sigmoid activation function:
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# Initialize the neuron class and its variables (weights and bias):
class Neuron:
    def __init__(self, weights, bias):
        self.weights = weights
        self.bias = bias
    
    # Define the "feedforward" method for computing the output of the neuron:
    def feedforward(self, x): 
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
        out_h1 = self.h1.feedforward(x)     # This defines the outputs of 
        out_h2 = self.h2.feedforward(x)

        out_o1 = self.o1.feedforward(np.array([out_h1, out_h2]))
        return out_o1

network = NeuralNetwork()
x = np.array([2,3])
print(network.feedforward(x))

>>>>>>> 3ac0588 (Simple, untrained Neural Network added)

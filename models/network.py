import numpy as np
from models.neuron import Neuron
from utils.activation import sigmoid, deriv_sig
from utils.loss import mse_loss

class NeuralNetwork:
    def __init__(self, input_size, hidden_size, num_layers):
        # Build hidden layers
        self.hidden_layers = []
        prev_size = input_size

        # iterates through the amount of layers user gave and adds neurons to each layer and each layer to the collection of layers.
        for _ in range(num_layers): #all code in this loop happens for each hidden layer.
            layer = [] #creates blank list that will contain neurons in the layer.
            for _ in range(hidden_size): #all code in this loop happens for each neuron in one layer.
                layer.append(Neuron(prev_size)) #add the neuron to the list of neurons for the layer.
            self.hidden_layers.append(layer) #adds the entire layer (list of neurons) to the list of layers.
            prev_size = hidden_size 

        # initializes the single output neuron
        self.output_neuron = Neuron(hidden_size)

    def feedforward(self, x):
        for layer in self.hidden_layers: #this code happens for each layer in the list of hidden layers.
            new_x = [] #creates a list of outputs from each neuron
            for neuron in layer:
                new_x.append(neuron(x)) #adds each neurons output to list of outputs
            x = new_x
        # Finally pass the result to the output neuron
        return self.output_neuron(x)

    def train(self, data, all_y_trues, learn_rate=0.05, epochs=1000):
        for epoch in range(epochs + 1):
            for x, y_true in zip(data, all_y_trues):
                # Forward pass: store activations at each layer
                activations = [x]  # input is the first "activation"
                for layer in self.hidden_layers: #for each layer in the list of hidden layers:
                    layer_output = [] # creates blank list of neuron outputs for each layer.
                    for neuron in layer: #for each neuron in the individual layer.
                        layer_output.append(neuron(activations[-1])) #adds the output of each neuron to the list of neuron outputs for that layer. Also, each neuron takes the input of whatever the previous layer outputted (activations[-1]).
                    activations.append(layer_output) #adds the output of the layer to activations which will be used in the next iteration (next layer).

                # Output neuron forward pass
                y_pred = self.output_neuron(activations[-1])

                # 1) Compute error and gradient at output
                error = 2 * (y_pred - y_true)
                dZ_out = error * deriv_sig(y_pred)

                # 2) Update the output neuron (weights and bias)
                for weight_i in range(len(self.output_neuron.weights)):
                    self.output_neuron.weights[weight_i] -= learn_rate * dZ_out * activations[-1][weight_i]
                self.output_neuron.bias -= learn_rate * dZ_out

                # 3) Prepare gradient for the hidden layer below
                grad = [dZ_out * w for w in self.output_neuron.weights]

                for i in reversed(range(len(self.hidden_layers))): #for each layer (from last to first).
                    layer = self.hidden_layers[i]
                    layer_input = activations[i]     # input to this layer
                    layer_output = activations[i+1]  # output from this layer

                    # Create a new gradient array for the layer below
                    new_grad = np.zeros_like(layer_input, dtype=np.float64) #ensures that new grad is the same size as layer_input so we can do element wise operations.

                    for j, neuron in enumerate(layer): #for each neuron in the current layer
                        dZ_hidden = grad[j] * deriv_sig(layer_output[j]) 

                        # Update weights and bias for this neuron
                        for weight_i in range(len(neuron.weights)): #loops for each weight in neuron.
                            neuron.weights[weight_i] -= learn_rate * dZ_hidden * layer_input[weight_i] #adjusts weights one by one
                        neuron.bias -= learn_rate * dZ_hidden #change the one bias

                        # Accumulate gradient for the next backprop step
                        for weight_i in range(len(neuron.weights)):
                            new_grad[weight_i] += neuron.weights[weight_i] * dZ_hidden

                    grad = new_grad #pass new_grad on to the next (lower) layer

            # Print loss every 100 epochs
            if epoch % 100 == 0:
                y_preds = []
                for x in data:
                    y_preds.append(self.feedforward(x))
                loss = mse_loss(all_y_trues, y_preds)
                print(f"Epoch {epoch} loss: {loss:.6f}")

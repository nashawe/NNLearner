import numpy as np
from neuron import Neuron
from activation import sigmoid, deriv_sig
from loss import mse_loss

class NeuralNetwork:
    def __init__(self, input_size, hidden_size=2):
        self.hidden_layer = [Neuron(input_size) for _ in range(hidden_size)]
        self.output_neuron = Neuron(hidden_size)
    
    def feedforward(self, x):
        # Calculate hidden layer outputs and feed them to the output neuron
        hidden_outputs = np.array([neuron(x) for neuron in self.hidden_layer])
        return self.output_neuron(hidden_outputs)
    
    def train(self, data, all_y_trues, learn_rate=0.05, epochs=1000):
        for epoch in range(epochs):
            for x, y_true in zip(data, all_y_trues):
                hidden_outputs = np.array([neuron(x) for neuron in self.hidden_layer])
                y_pred = self.output_neuron(hidden_outputs)

                # Calculate gradients for the output neuron
                output_grad = 2 * (y_pred - y_true) * deriv_sig(y_pred)
                self.output_neuron.weights -= learn_rate * output_grad * hidden_outputs
                self.output_neuron.bias -= learn_rate * output_grad

                # Backpropagate gradients to the hidden layer neurons
                hidden_grads = [
                    output_grad * self.output_neuron.weights[i] * deriv_sig(hidden_outputs[i])
                    for i in range(len(self.hidden_layer))
                ]
                for i, neuron in enumerate(self.hidden_layer):
                    neuron.weights -= learn_rate * hidden_grads[i] * x
                    neuron.bias -= learn_rate * hidden_grads[i]

            if epoch % 100 == 0:
                y_preds = np.apply_along_axis(self.feedforward, 1, data)
                loss = mse_loss(all_y_trues, y_preds)
                print(f"Epoch {epoch} loss: {loss:.6f}")

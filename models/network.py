import numpy as np
import random
from models.neuron import Neuron
from utils.activation import sigmoid, deriv_sig
from utils.loss import mse_loss

class NeuralNetwork:
    def __init__(self, input_size, hidden_size, num_layers, config, dropout_rate=0, init_fn=None, optimizer_choice=1):
        self.hidden_activation = config["hidden_activation"]
        self.hidden_deriv = config["hidden_deriv"]
        self.output_activation = config["output_activation"]
        self.output_deriv = config["output_deriv"]
        self.loss = config["loss"]
        self.loss_grad = config["loss_grad"]
        self.dropout_rate = dropout_rate
        self.optimizer_choice = optimizer_choice
        self.opt_states = {}  # stores momentums etc. for RMSprop/Adam
        self.timestep = 1     # for Adam bias correction

        # Build hidden layers
        self.hidden_layers = []
        prev_size = input_size

        # iterates through the amount of layers user gave and adds neurons to each layer and each layer to the collection of layers.
        for _ in range(num_layers): #all code in this loop happens for each hidden layer.
            layer = [] #creates blank list that will contain neurons in the layer.
            for _ in range(hidden_size): #all code in this loop happens for each neuron in one layer.
                layer.append(Neuron(prev_size, init_fn)) #add the neuron to the list of neurons for the layer.
            self.hidden_layers.append(layer) #adds the entire layer (list of neurons) to the list of layers.
            prev_size = hidden_size 

        # initializes the single output neuron
        self.output_neuron = Neuron(hidden_size, init_fn)
        if self.optimizer_choice in [2, 3]:  # 2 = RMSprop, 3 = Adam
            self._init_optimizer_states()

    def _init_optimizer_states(self):
        def zero_like_shape(shape):
            return np.zeros(shape, dtype=np.float64)

        # For each hidden neuron
        for l_idx, layer in enumerate(self.hidden_layers):
            for n_idx, neuron in enumerate(layer):
                key = (l_idx, n_idx)
                self.opt_states[key] = {
                    'm': zero_like_shape(neuron.weights.shape),  # First moment (Adam)
                    'v': zero_like_shape(neuron.weights.shape),  # Second moment (Adam/RMSprop)
                    'mb': 0.0,  # Bias moment (Adam)
                    'vb': 0.0,  # Bias variance (Adam/RMSprop)
                }

        # For output neuron
        self.opt_states['output'] = {
            'm': zero_like_shape(self.output_neuron.weights.shape),
            'v': zero_like_shape(self.output_neuron.weights.shape),
            'mb': 0.0,
            'vb': 0.0,
        }
    def _update_weights(self, key, weights, grads, bias, dbias, learn_rate):
        state = self.opt_states[key]
        eps = 1e-8
        beta1, beta2 = 0.9, 0.999
        self.timestep += 1

        if self.optimizer_choice == 2:  # RMSprop
            state['v'] = 0.9 * state['v'] + 0.1 * (grads ** 2)
            state['vb'] = 0.9 * state['vb'] + 0.1 * (dbias ** 2)

            weights -= learn_rate * grads / (np.sqrt(state['v']) + eps)
            bias -= learn_rate * dbias / (np.sqrt(state['vb']) + eps)

        elif self.optimizer_choice == 3:  # Adam
            state['m'] = beta1 * state['m'] + (1 - beta1) * grads
            state['v'] = beta2 * state['v'] + (1 - beta2) * (grads ** 2)
            m_hat = state['m'] / (1 - beta1 ** self.timestep)
            v_hat = state['v'] / (1 - beta2 ** self.timestep)

            state['mb'] = beta1 * state['mb'] + (1 - beta1) * dbias
            state['vb'] = beta2 * state['vb'] + (1 - beta2) * (dbias ** 2)
            mb_hat = state['mb'] / (1 - beta1 ** self.timestep)
            vb_hat = state['vb'] / (1 - beta2 ** self.timestep)

            weights -= learn_rate * m_hat / (np.sqrt(v_hat) + eps)
            bias -= learn_rate * mb_hat / (np.sqrt(vb_hat) + eps)

        return weights, bias

    def feedforward(self, x):
        for layer in self.hidden_layers: #this code happens for each layer in the list of hidden layers.
            new_x = [] #creates a list of outputs from each neuron
            for neuron in layer:
                z = np.dot(neuron.weights, x) + neuron.bias
                new_x.append(self.hidden_activation(z)) #adds each neurons output to list of outputs
            x = new_x
        # Finally pass the result to the output neuron
        z_out = np.dot(self.output_neuron.weights, x) + self.output_neuron.bias
        return self.output_activation(z_out)

    def train(self, data, all_y_trues, learn_rate=0.05, epochs=1000, batch_size=None):
        for epoch in range(epochs + 1):
            total_dropped = 0
            total_neurons = 0
            if batch_size is not None: #check if user wants mini-batch or not
                #if they do shuffle the data:
                indices = np.arange(len(data)) #create an array (1, 2, 3...) that has the amount of numbers as there are data points.
                np.random.shuffle(indices) #shuffle up this array to get a random order.
                data = data[indices] #then redefine the dataset in that new order
                all_y_trues = all_y_trues[indices] #then redefine the labels of that dataset to the same new order.
                
                for start in range(0, len(data), batch_size): #iterate through all the data but this time in increments of batch_size
                    end = start + batch_size #this tells us the end of the batch its on
                    batch_data = data[start:end] #sets the batch_data to the section of data from start to end
                    batch_labels = all_y_trues[start:end] #does the same thing with the batch_labels
                
                    for x, y_true in zip(batch_data, batch_labels): #iterates through both data (in batches) and the corresponding labels (in batches)
                        dropped, total = self._train_sample(x, y_true, learn_rate) #call general backprop training function
                        total_dropped += dropped
                        total_neurons += total
            else:
                for x, y_true in zip(data, all_y_trues): #iterates through both data (not in batches) and labels (not in batches)
                    dropped, total = self._train_sample(x, y_true, learn_rate) #call general backprop training function
                    total_dropped += dropped
                    total_neurons += total
                
            # Print loss every 100 epochs
            if epoch % 100 == 0:
                y_preds = [self.feedforward(x) for x in data]
                loss = self.loss(all_y_trues, y_preds)
                dropout_info = ""
                if self.dropout_rate > 0 and total_neurons > 0:
                    pct = 100 * total_dropped / total_neurons
                    dropout_info = f" | Total dropout: {total_dropped}/{total_neurons} ({pct:.1f}%)"
                print(f"Epoch {epoch} loss: {loss:.6f}{dropout_info}")



    def _train_sample(self, x, y_true, learn_rate): #this is a helper function so I don't have to rewrite for batch-size vs non batch-size training      
        # Forward pass: store activations at each layer
        activations = [x]  # input is the first "activation"
        sample_dropped = 0
        sample_total = 0
        for layer in self.hidden_layers: #for each layer in the list of hidden layers:
            layer_output = [] # creates blank list of neuron outputs for each layer.
            dropped_count = 0
            for neuron in layer: #for each neuron in the individual layer.
                neuron.dropped = np.random.rand() < self.dropout_rate
                if neuron.dropped:
                    dropped_count += 1
                    a = 0
                else:
                    z = np.dot(neuron.weights, activations[-1]) + neuron.bias #gets raw output of neuron
                    a = (self.hidden_activation(z)) / (1 - self.dropout_rate) #apply activation function divided by dropout_rate
                layer_output.append(a)
            activations.append(layer_output)
            sample_dropped += dropped_count
            sample_total += len(layer)

        # Output neuron forward pass
        z_out = np.dot(self.output_neuron.weights, activations[-1]) + self.output_neuron.bias
        y_pred = self.output_activation(z_out)


        # 1) Compute error and gradient at output
        error = self.loss_grad(y_pred, y_true)
        dZ_out = error * self.output_deriv(z_out)


        # 2) Update the output neuron (weights and bias)
        grads = dZ_out * np.array(activations[-1])
        bias_grad = dZ_out

        if self.optimizer_choice == 1:
            self.output_neuron.weights -= learn_rate * grads
            self.output_neuron.bias -= learn_rate * bias_grad
        else:
            w, b = self._update_weights('output', self.output_neuron.weights, grads, self.output_neuron.bias, bias_grad, learn_rate)
            self.output_neuron.weights = w
            self.output_neuron.bias = b



        # 3) Prepare gradient for the hidden layer below
        grad = [dZ_out * w for w in self.output_neuron.weights]

        for i in reversed(range(len(self.hidden_layers))): #for each layer (from last to first).
            layer = self.hidden_layers[i]
            layer_input = activations[i]     # input to this layer
            layer_output = activations[i+1]  # output from this layer

            # Create a new gradient array for the layer below
            new_grad = np.zeros_like(layer_input, dtype=np.float64) #ensures that new grad is the same size as layer_input so we can do element wise operations.

            for j, neuron in enumerate(layer): #for each neuron in the current layer
                if neuron.dropped:
                    continue
                dZ_hidden = grad[j] * self.hidden_deriv(layer_output[j]) 

                # Update weights and bias for this neuron
                grads = dZ_hidden * np.array(layer_input)
                bias_grad = dZ_hidden

                if self.optimizer_choice == 1:
                    neuron.weights -= learn_rate * grads
                    neuron.bias -= learn_rate * bias_grad
                else:
                    key = (i, j)  # i = layer index, j = neuron index
                    w, b = self._update_weights(key, neuron.weights, grads, neuron.bias, bias_grad, learn_rate)
                    neuron.weights = w
                    neuron.bias = b
                # Accumulate gradient for the next backprop step
                for weight_i in range(len(neuron.weights)):
                    new_grad[weight_i] += neuron.weights[weight_i] * dZ_hidden

            grad = new_grad #pass new_grad on to the next (lower) layer
        return sample_dropped, sample_total
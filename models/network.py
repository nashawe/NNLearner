import numpy as np
import random
from models.neuron import Neuron
from utils.activation import sigmoid, deriv_sig
from utils.loss import mse_loss
from utils.testing import test_model_loop

class NeuralNetwork:
    def __init__(self, input_size, hidden_size, num_layers, output_size, config, dropout_rate=0, init_fn=None, optimizer_choice=1):
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
        self.output_size = output_size #output_size is the number of output neurons in the output layer
        self.output_layer = [Neuron(hidden_size, init_fn) for _ in range(output_size)] #set up the output layer 

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
        for l_index, layer in enumerate(self.hidden_layers):
            for n_index, neuron in enumerate(layer):
                key = (l_index, n_index) #give each neuron a "name" of sorts where its like: (layer, neuron)
                self.opt_states[key] = { #for each neuron, it stores the attributes of the neuron in 4 variables:
                    'm': zero_like_shape(neuron.weights.shape),  # First moment (Adam)
                    'v': zero_like_shape(neuron.weights.shape),  # Second moment (Adam/RMSprop)
                    'mb': 0.0,  # Bias moment (Adam)
                    'vb': 0.0,  # Bias variance (Adam/RMSprop)
                }

        # For each output neuron
        for i, neuron in enumerate(self.output_layer):
            self.opt_states[f"output_{i}"] = {
                'm': zero_like_shape(neuron.weights.shape),
                'v': zero_like_shape(neuron.weights.shape),
                'mb': 0.0,
                'vb': 0.0,
            }
    def _update_weights(self, key, weights, grads, bias, dbias, learn_rate):
        state = self.opt_states[key]
        eps = 1e-8
        beta1, beta2 = 0.9, 0.999
        self.timestep += 1

        if self.optimizer_choice == 2:  # RMSprop
            state['v'] = 0.9 * state['v'] + 0.1 * (grads ** 2)  # Update the second moment
            state['vb'] = 0.9 * state['vb'] + 0.1 * (dbias ** 2)  # Update the bias variance

            weights -= learn_rate * grads / (np.sqrt(state['v']) + eps)  # Update the weights using RMSprop
            bias -= learn_rate * dbias / (np.sqrt(state['vb']) + eps)  # Update the bias using RMSprop

        elif self.optimizer_choice == 3:  # Adam
            state['m'] = beta1 * state['m'] + (1 - beta1) * grads  # Update the first moment
            state['v'] = beta2 * state['v'] + (1 - beta2) * (grads ** 2)  # Update the second moment
            m_hat = state['m'] / (1 - beta1 ** self.timestep)  # Bias-corrected first moment
            v_hat = state['v'] / (1 - beta2 ** self.timestep)  # Bias-corrected second moment

            state['mb'] = beta1 * state['mb'] + (1 - beta1) * dbias  # Update the bias moment
            state['vb'] = beta2 * state['vb'] + (1 - beta2) * (dbias ** 2)  # Update the bias variance
            mb_hat = state['mb'] / (1 - beta1 ** self.timestep)  # Bias-corrected bias moment
            vb_hat = state['vb'] / (1 - beta2 ** self.timestep)  # Bias-corrected bias variance

            weights -= learn_rate * m_hat / (np.sqrt(v_hat) + eps)  # Update the weights using Adam
            bias -= learn_rate * mb_hat / (np.sqrt(vb_hat) + eps)  # Update the bias using Adam

        return weights, bias

    def feedforward(self, x):
        for layer in self.hidden_layers: #this code happens for each layer in the list of hidden layers.
            new_x = [] #creates a list of outputs from each neuron
            for neuron in layer:
                z = np.dot(neuron.weights, x) + neuron.bias
                new_x.append(self.hidden_activation(z)) #adds each neurons output to list of outputs
            x = new_x
        #now collect all logits for the output layer
        z_vector = []
        for neuron in self.output_layer:
            z = np.dot(neuron.weights, x) + neuron.bias
            z_vector.append(z)

        z_vector = np.array(z_vector)

        # If using softmax, do it exactly once across the entire vector
        if self.output_activation.__name__ == "softmax":  
            return self.output_activation(z_vector)
        else:
            # e.g., for sigmoid or tanh, do them individually
            return np.array([self.output_activation(z) for z in z_vector])

    def train(self, data, all_y_trues, learn_rate=0.05, epochs=1000, bsize=None):
        loss_history = []
        accuracy_history = []
        for epoch in range(epochs + 1):
            total_dropped = 0
            total_neurons = 0
            if bsize is not None: #check if user wants mini-batch or not
                #if they do shuffle the data:
                indices = np.arange(len(data)) #create an array (1, 2, 3...) that has the amount of numbers as there are data points.
                np.random.shuffle(indices) #shuffle up this array to get a random order.
                data = data[indices] #then redefine the dataset in that new order
                all_y_trues = all_y_trues[indices] #then redefine the labels of that dataset to the same new order.
                
                for start in range(0, len(data), bsize): #iterate through all the data but this time in increments of batch size
                   
                    end = start + bsize #this tells us the end of the batch its on
                    batch_data = data[start:end] #sets the batch_data to the section of data from start to end
                    batch_labels = all_y_trues[start:end] #does the same thing with the batch_labels
                    self.timestep = 1
                    for x, y_true in zip(batch_data, batch_labels): #iterates through both data (in batches) and the corresponding labels (in batches)
                        
                        dropped, total = self._train_sample(x, y_true, learn_rate) #call general backprop training function
                        total_dropped += dropped
                        total_neurons += total
            else:
                for x, y_true in zip(data, all_y_trues): #iterates through both data (not in batches) and labels (not in batches)
                    self.timestep = 1
                    dropped, total = self._train_sample(x, y_true, learn_rate) #call general backprop training function
                    total_dropped += dropped
                    total_neurons += total
                
            # Print loss every 100 epochs
            if epoch % 100 == 0:
                y_preds = np.array([self.feedforward(x)[0] for x in data]) if self.output_size == 1 else np.array([self.feedforward(x) for x in data])

                loss = self.loss(all_y_trues, y_preds)
                loss_history.append(loss) #add the loss to the loss history
                
                # Compute predictions and loss
                if self.output_size == 1 and self.loss.__name__ == "bce_loss":
                    from utils.metrics import accuracy
                    acc = accuracy(all_y_trues, y_preds)
                elif self.output_size > 1:
                    from utils.metrics import multiclass_accuracy
                    acc = multiclass_accuracy(all_y_trues, y_preds)
                else:
                    acc = None

                if acc is not None:
                    accuracy_history.append(acc)

                dropout_info = ""
                if self.dropout_rate > 0 and total_neurons > 0:
                    pct = 100 * total_dropped / total_neurons
                    dropout_info = f" | Total dropout: {total_dropped}/{total_neurons} ({pct:.1f}%)"
                print(f"Epoch {epoch} loss: {loss:.6f}{dropout_info}")
                
        if self.output_size == 1 and self.loss.__name__ == "bce_loss": #run metrics only if binary and bce loss
            from utils.metrics import accuracy, precision, recall, f1_score
            y_preds = np.array([self.feedforward(x)[0] for x in data]) #set y_preds
            acc = accuracy(all_y_trues, y_preds) #call the accuracy function
            prec = precision(all_y_trues, y_preds) #call the precision function 
            rec = recall(all_y_trues, y_preds) #call the recall function    
            f1 = f1_score(all_y_trues, y_preds) #call the f1 function
            
            print("\nFinal Training Metrics:") #print the metrics at the end
            print(f"Accuracy:  {acc:.4f}")
            print(f"Precision: {prec:.4f}")
            print(f"Recall:    {rec:.4f}")
            print(f"F1 Score:  {f1:.4f}")
        else:
            from utils.metrics import multiclass_accuracy
            y_preds = np.array([self.feedforward(x) for x in data])
            acc = multiclass_accuracy(all_y_trues, y_preds)
            print(f"\nFinal Training Metrics:")
            print(f"Multiclass Accuracy: {acc:.4f}")
            
        self.loss_history = loss_history
        self.accuracy_history = accuracy_history


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

        y_pred = self.feedforward(x)
        dZ_outs = []
        zs = []
        #iterate through each output neuron (like its a layer)
        if not isinstance(y_true, (list, np.ndarray)):
            y_true = np.array([y_true])
        else:
            y_true = np.array(y_true)

        if y_true.shape[0] != self.output_size:
            raise ValueError(f"Expected y_true to have {self.output_size} values, but got {y_true.shape[0]} instead.")

        for i, neuron in enumerate(self.output_layer):
            z = np.dot(neuron.weights, activations[-1]) + neuron.bias
            zs.append(z)
            if self.output_deriv is None:
                dZ = self.loss_grad(y_pred, y_true)[i]
            else:
                error = self.loss_grad(y_pred[i], y_true[i])
                dZ = error * self.output_deriv(z)
            dZ_outs.append(dZ)            
        
        for i, neuron in enumerate(self.output_layer):
            grads = dZ_outs[i] * np.array(activations[-1])
            bias_grad = dZ_outs[i]
            
            if self.optimizer_choice == 1:
                neuron.weights -= learn_rate * grads
                neuron.bias -= learn_rate * bias_grad
            else:
                key = f"output_{i}"
                w, b = self._update_weights(key, neuron.weights, grads, neuron.bias, bias_grad, learn_rate)
                neuron.weights = w
                neuron.bias = b
            
        grad = np.zeros_like(activations[-1], dtype=np.float64)
        

        for i, neuron in enumerate(self.output_layer):
            for j in range(len(neuron.weights)):
                grad[j] += dZ_outs[i] * neuron.weights[j]

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
        for dz in dZ_outs:
            if np.isnan(dz) or np.isinf(dz):
                print("Gradient explosion!", dz)

        return sample_dropped, sample_total
    
    
    def save_model(self, filename="my_model.npz", input_size=None, hidden_size=None, num_layers=None,
               dropout_rate=None, optimizer_choice=None, mode_id=None, bsize=None):
        model_data = {}
        
        #save architecture info
        model_data["input_size"] = input_size
        model_data["hidden_size"] = hidden_size
        model_data["num_layers"] = num_layers
        model_data["dropout_rate"] = dropout_rate
        model_data["optimizer_choice"] = optimizer_choice
        model_data["mode_id"] = mode_id
        model_data["batch_size"] = bsize
        model_data["output_size"] = self.output_size
        
        #go through each neuron and save its weights and bias
        for layer_index, layer in enumerate(self.hidden_layers):
            for neuron_index, neuron in enumerate(layer):
                key_w = f"hidden_{layer_index}_{neuron_index}_weights"
                key_b = f"hidden_{layer_index}_{neuron_index}_bias"
                model_data[key_w] = neuron.weights
                model_data[key_b] = neuron.bias 
        
        # Save all output neurons
        for i, neuron in enumerate(self.output_layer):
            model_data[f"output_{i}_weights"] = neuron.weights
            model_data[f"output_{i}_bias"] = neuron.bias
        
        #save to .npz file
        save_path = os.path.join("saved_models", filename)
        np.savez(save_path, **model_data)
        print(f"Model saved to {save_path}")
        
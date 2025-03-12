import numpy as np

# Define the sigmoid activation function:
def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def deriv_sig(x):
    fx = sigmoid(x)
    return fx * (1 - fx)

def mse_loss(y_true, y_pred):
  # y_true and y_pred are numpy arrays of the same length.
  return ((y_true - y_pred) ** 2).mean()

class Neuron:
    def __init__(self, weights, bias):
        self.weights = weights
        self.bias = bias
    
    # Define the method for computing the output of the neuron:
    def __call__(self, x):      #__call__ makes it so that the neuron class can be called later on as a function
        # Uses np.dot to calculate dot product of inputs and weights. Adds the bias.
        total = np.dot(self.weights, x) + self.bias
        sig_val = sigmoid(total)
        return sig_val

# Initialize the neuron class and its variables (weights and bias):
class NeuralNetwork:
    def __init__(self):
        #create each neuron with independent weights and biases
        self.h1 = Neuron([np.random.normal(), np.random.normal()], np.random.normal())
        self.h2 = Neuron([np.random.normal(), np.random.normal()], np.random.normal())
        self.o1 = Neuron([np.random.normal(), np.random.normal()], np.random.normal())
    
    def feedforward(self, x):
        out_h1 = self.h1(x)
        out_h2 = self.h2(x)
        out_o1 = self.o1([out_h1, out_h2])
        return out_o1
    
    #function to train network
    def train(self, data, all_y_trues):
        learn_rate = 0.1
        epochs = 1000

        for epoch in range(epochs):
            for x, y_true in zip(data, all_y_trues):
                # Forward pass
                raw_h1 = self.h1(x)
                raw_h2 = self.h2(x)
                o1 = self.o1([raw_h1, raw_h2])

                # Set the outcome of network to predicted value
                y_pred = o1

                # Neuron o1
                d_L_d_ypred = -2 * (y_true - y_pred)
                d_ypred_d_w5 = raw_h1 * deriv_sig(o1)
                d_ypred_d_w6 = raw_h2 * deriv_sig(o1)
                d_ypred_d_b3 = deriv_sig(o1)

                d_ypred_d_h1 = self.o1.weights[0] * deriv_sig(o1)
                d_ypred_d_h2 = self.o1.weights[1] * deriv_sig(o1)

                # Neuron h1
                d_h1_d_w1 = x[0] * deriv_sig(raw_h1)
                d_h1_d_w2 = x[1] * deriv_sig(raw_h1)
                d_h1_d_b1 = deriv_sig(raw_h1)

                # Neuron h2
                d_h2_d_w3 = x[0] * deriv_sig(raw_h2)
                d_h2_d_w4 = x[1] * deriv_sig(raw_h2)
                d_h2_d_b2 = deriv_sig(raw_h2)

                # Update weights and biases
                # Neuron o1
                self.o1.weights[0] -= learn_rate * d_L_d_ypred * d_ypred_d_w5
                self.o1.weights[1] -= learn_rate * d_L_d_ypred * d_ypred_d_w6
                self.o1.bias -= learn_rate * d_L_d_ypred * d_ypred_d_b3

                # Neuron h1
                self.h1.weights[0] -= learn_rate * d_L_d_ypred * d_ypred_d_h1 * d_h1_d_w1
                self.h1.weights[1] -= learn_rate * d_L_d_ypred * d_ypred_d_h1 * d_h1_d_w2
                self.h1.bias -= learn_rate * d_L_d_ypred * d_ypred_d_h1 * d_h1_d_b1

                # Neuron h2
                self.h2.weights[0] -= learn_rate * d_L_d_ypred * d_ypred_d_h2 * d_h2_d_w3
                self.h2.weights[1] -= learn_rate * d_L_d_ypred * d_ypred_d_h2 * d_h2_d_w4
                self.h2.bias -= learn_rate * d_L_d_ypred * d_ypred_d_h2 * d_h2_d_b2

                #calculate the total loss at the end of each epoch
            if epoch % 100 == 0:
                y_preds = np.apply_along_axis(self.feedforward, 1, data)
                loss = mse_loss(all_y_trues, y_preds)
                print("Epoch %d loss: %.3f" % (epoch, loss))
     
#define dataset
data = np.array([
    [-2,-1],    #alice
    [25,6],     #bob
    [17,4],     #charlie
    [-15,-6],   #diana
])
all_y_trues = np.array([
    1,  #Alice
    0,  #bob
    0,  #charlie
    1,  #diana
])

#train the network
network = NeuralNetwork()
network.train(data, all_y_trues)
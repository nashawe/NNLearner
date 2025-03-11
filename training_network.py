import numpy as np

# Define the sigmoid activation function:
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def deriv_sig(x):
    fx = sigmoid(x)
    return fx * (1 - fx)

def mse_loss(y_true, y_pred):
  # y_true and y_pred are numpy arrays of the same length.
  return ((y_true - y_pred) ** 2).mean()

# Initialize the neuron class and its variables (weights and bias):
class NeuralNetwork:
    def __init__(self):
        #weights:
        self.w1 = np.random.normal()
        self.w2 = np.random.normal()
        self.w3 = np.random.normal()
        self.w4 = np.random.normal()
        self.w5 = np.random.normal()
        self.w6 = np.random.normal()

        # bias:
        self.b1 = np.random.normal()
        self.b2 = np.random.normal()
        self.b3 = np.random.normal()
    
    def feedforward(self, x):
        h1 = sigmoid(self.w1 * x[0] + self.w2 * x[1] + self.b1)
        h2 = sigmoid(self.w3 * x[0] + self.w4 * x[1] + self.b2)
        o1 = sigmoid(self.w5 * h1 + self.w6 * h2 + self.b3)
        return o1
    
    #function to train network
    def train(self, data, all_y_trues):
        learn_rate = 0.1
        epochs = 1000

        for epoch in range(epochs):
            for x, y_true in zip(data, all_y_trues):
                #the same feedforward as before
                raw_h1 = self.w1 * x[0] + self.w2 * x[1] + self.b1
                h1 = sigmoid(raw_h1)

                raw_h2 = self.w3 * x[0] + self.w4 * x[1] + self.b2
                h2 = sigmoid(raw_h2)

                raw_o1 = self.w5 * h1 + self.w6 * h2 + self.b3
                o1 = sigmoid(raw_o1)
            #set the outcome of network to predicted value
                y_pred = o1

                #neuron o1
                d_L_d_ypred = -2 * (y_true - y_pred)
                d_ypred_d_w5 = h1 * deriv_sig(raw_o1)
                d_ypred_d_w6 = h2 * deriv_sig(raw_o1)
                d_ypred_d_b3 = deriv_sig(raw_o1)

                d_ypred_d_h1 = self.w5 * deriv_sig(raw_o1)
                d_ypred_d_h2 = self.w6 * deriv_sig(raw_o1)

                # Neuron h1
                d_h1_d_w1 = x[0] * deriv_sig(raw_h1)
                d_h1_d_w2 = x[1] * deriv_sig(raw_h1)
                d_h1_d_b1 = deriv_sig(raw_h1)

                #neuron h2
                d_h2_d_w3 = x[0] * deriv_sig(raw_h2)
                d_h2_d_w4 = x[1] * deriv_sig(raw_h2)
                d_h2_d_b2 = deriv_sig(raw_h2)

                #update weights and biases

                #neuron h1
                self.w1 -= learn_rate * d_L_d_ypred * d_ypred_d_h1 * d_h1_d_w1
                self.w2 -= learn_rate * d_L_d_ypred * d_ypred_d_h1 * d_h1_d_w2
                self.b1 -= learn_rate * d_L_d_ypred * d_ypred_d_h1 * d_h1_d_b1

                #neuron h2
                self.w3 -= learn_rate * d_L_d_ypred * d_ypred_d_h2 * d_h2_d_w3
                self.w4 -= learn_rate * d_L_d_ypred * d_ypred_d_h2 * d_h2_d_w4
                self.b2 -= learn_rate * d_L_d_ypred * d_ypred_d_h2 * d_h2_d_b2  

                #neuron o1
                self.w5 -= learn_rate * d_L_d_ypred * d_ypred_d_w5
                self.w6 -= learn_rate * d_L_d_ypred * d_ypred_d_w6
                self.b3 -= learn_rate * d_L_d_ypred * d_ypred_d_b3

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
import numpy as np

# Define the sigmoid activation function and its derivative:
def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def deriv_sig(activated):
    # Assumes the input is already the output of the sigmoid function.
    return activated * (1 - activated)

def mse_loss(y_true, y_pred):
    return ((y_true - y_pred) ** 2).mean()

class Neuron:
    def __init__(self, num_inputs):
        self.weights = np.random.normal(size=num_inputs)
        self.bias = np.random.normal()
    
    def __call__(self, x):
        total = np.dot(self.weights, x) + self.bias
        return sigmoid(total)

class NeuralNetwork:
    def __init__(self, input_size, hidden_size=2):
        self.hidden_layer = [Neuron(input_size) for _ in range(hidden_size)]
        self.output_neuron = Neuron(hidden_size)
    
    def feedforward(self, x):
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

if __name__ == '__main__':
    # User input for network parameters and training data
    input_size = int(input("Enter the number of inputs per sample: "))
    hidden_size = int(input("Enter the number of hidden neurons: "))
    learn_rate = float(input("Enter the learning rate (e.g., 0.05): "))
    epochs = int(input("Enter the number of epochs for training: "))

    # Get training data block input
    print("\nPaste your training data here.")
    print("Each line should represent a sample with comma-separated values.")
    print("When you're done, enter an empty line to finish:")
    data_lines = []
    while True:
        line = input()
        if line.strip() == "":
            break
        data_lines.append(line)
    data = np.array([[float(value.strip()) for value in line.split(',')] for line in data_lines])
    
    # Get labels as a single comma-separated line
    labels_input = input("\nPaste the labels for each sample, separated by commas: ")
    labels = np.array([float(label.strip()) for label in labels_input.split(',')])
    
    # Create and train the neural network
    network = NeuralNetwork(input_size, hidden_size)
    network.train(data, labels, learn_rate=learn_rate, epochs=epochs)
    print("\nTraining complete!")
    
    # Ask the user if they'd like to test the model
    test_choice = input("Would you like to test the model with new data? (y/n): ").strip().lower()
    if test_choice == 'y':
        print("\nPaste your test data here (each line is a sample, comma-separated values).")
        print("When you're done, enter an empty line to finish:")
        test_data_lines = []
        while True:
            line = input()
            if line.strip() == "":
                break
            test_data_lines.append(line)
        test_data = np.array([[float(value.strip()) for value in line.split(',')] for line in test_data_lines])
        
        print("\nModel predictions:")
        for sample in test_data:
            prediction = network.feedforward(sample)
            if prediction >= 0.5:
                print("Input:", sample, "Prediction: Dead")
            else:
                print("Input:", sample, "Prediction: Survived")

    else:
        print("Okay, testing skipped. Good job on training your model!")

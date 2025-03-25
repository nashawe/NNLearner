import numpy as np
from models.network import NeuralNetwork
from utils.activation import sigmoid, deriv_sig, tanh, deriv_tanh, relu, deriv_relu #imports all activation functions
from utils.loss import mse_loss, bce_loss  #imports all loss functions

def clipped_bce_grad(y_pred, y_true, eps=1e-7): #defined as seperate function because BCE can cause issues if not clipped.
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return (y_pred - y_true) / (y_pred * (1 - y_pred))

#dictionary of dictionaries for each component of each mode that can be selected.
MODES = {
    1: {  # Sigmoid + MSE
        "hidden_activation": sigmoid,
        "hidden_deriv": deriv_sig,
        "output_activation": sigmoid,
        "output_deriv": deriv_sig,
        "loss": mse_loss,
        "loss_grad": lambda y_pred, y_true: 2 * (y_pred - y_true),
    },
    2: {  # Sigmoid + Binary Cross-Entropy
        "hidden_activation": sigmoid,
        "hidden_deriv": deriv_sig,
        "output_activation": sigmoid,
        "output_deriv": deriv_sig,
        "loss": bce_loss,
        "loss_grad": lambda y_pred, y_true: (y_pred - y_true) / (y_pred * (1 - y_pred) + 1e-15),
    },
    3: {  # Tanh + MSE
        "hidden_activation": tanh,
        "hidden_deriv": deriv_tanh,
        "output_activation": tanh,
        "output_deriv": deriv_tanh,
        "loss": mse_loss,
        "loss_grad": lambda y_pred, y_true: 2 * (y_pred - y_true),
    },
    4: {  # ReLU + Sigmoid + Binary Cross-Entropy
        "hidden_activation": relu,
        "hidden_deriv": deriv_relu,
        "output_activation": sigmoid, #different than hidden activation because ReLu doesn't work for output neuron.
        "output_deriv": deriv_sig, 
        "loss": bce_loss,
        "loss_grad": clipped_bce_grad,
    },
}

if __name__ == '__main__':
    # User input for network parameters and training data
    print("Choose a model setup (activation function + loss function):")
    print("1 - Sigmoid + Mean Squared Error (Good for regression or simple binary classification; not ideal for probabilities)")
    print("2 - Sigmoid + Binary Cross-Entropy (Best for binary classification; outputs are probabilities)")
    print("3 - Tanh + Mean Squared Error (Works for values between -1 and 1; can suffer from vanishing gradients)")
    print("4 - ReLU (hidden) + Sigmoid (output) + Binary Cross-Entropy (Fast and accurate for deeper models)")
    
    
    model_setup = int(input("Enter the number of your chosen setup (1-4): "))
    config = MODES[model_setup]
    input_size = int(input("Enter the number of inputs per sample: "))
    num_layers = int(input("Enter the number of hidden layers: "))
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
    network = NeuralNetwork(input_size, hidden_size, num_layers, config)
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
            print(f"Input: {sample} so prediction: {prediction}")
    else:
        print("Okay, testing skipped. Good job on training your model!")

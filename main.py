import numpy as np
from models.network import NeuralNetwork

if __name__ == '__main__':
    # User input for network parameters and training data
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
    network = NeuralNetwork(input_size, hidden_size, num_layers)
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
                print("Input:", sample, "Prediction: 1")
            else:
                print("Input:", sample, "Prediction: 0")
    else:
        print("Okay, testing skipped. Good job on training your model!")

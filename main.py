import numpy as np
from models.network import NeuralNetwork
from utils.activation import sigmoid, deriv_sig, tanh, deriv_tanh, relu, deriv_relu #imports all activation functions
from utils.loss import mse_loss, bce_loss  #imports all loss functions
from utils.winit import random_init, xavier_init, he_init
from utils.config import clipped_bce_grad, MODES
from utils.testing import test_model_loop
import os

WEIGHT_INITS = {
    1: random_init,
    2: xavier_init,
    3: he_init,
}

def load_full_model(filename):
    data = np.load(os.path.join("saved_models", filename))

    in_dim    = int(data["in_dim"])
    hid_units = int(data["hid_units"])
    n_hidden  = int(data["n_hidden"])
    out_dim   = int(data["out_dim"])
    mode_id   = int(data["mode_id"])
    config    = MODES[mode_id]

    # stub init that returns zeros so __init__ won’t insert Nones
    zeros_init = lambda fin, fout: np.zeros((fin, fout), dtype=np.float64)

    net = NeuralNetwork(
        input_dim=in_dim,
        hidden_units=hid_units,
        hidden_layers_count=n_hidden,
        output_dim=out_dim,
        mode_cfg=config,
        dropout_rate=0.0,
        init_fn=zeros_init,      # <— use zeros here
        optimizer_choice=1,
        use_scheduler=False,
        learn_rate=0.0,
    )

    # overwrite with your real trained params
    net.weights = [data[f"W{i}"] for i in range(n_hidden + 1)]
    net.biases  = [data[f"b{i}"] for i in range(n_hidden + 1)]

    # rebuild optimizer state arrays to match shapes
    net.state = [
        {"m": np.zeros(W.shape), "v": np.zeros(W.shape),
         "mb": np.zeros(b.shape), "vb": np.zeros(b.shape)}
        for W, b in zip(net.weights, net.biases)
    ]

       # pull norm metadata
    net.norm_method = data.get("norm_method", "none")
    if net.norm_method == "max":
        net.norm_max = data["norm_max"]
    elif net.norm_method == "zscore":
        net.norm_mean = data["norm_mean"]
        net.norm_std  = data["norm_std"]

    return net, config

def test_model_loop(network):
    while True:
        print("Paste samples, blank line when done (or 'q' to quit):")
        lines = []
        while True:
            ln = input().strip()
            if ln.lower() == 'q':
                return
            if ln == "":
                break
            lines.append(ln)
        if not lines:
            continue

        # parse → array
        try:
            X = np.vstack([np.fromstring(l, sep=',') for l in lines])
        except Exception as e:
            print("Parse error:", e)
            continue

        print("\n=== Predictions ===")
        X = network._apply_norm(X)            # <- normalize w/ saved stats
        probs = network.predict(X)

        binary = network.out_dim == 1
        for i, p in enumerate(probs, 1):
            if binary:
                prob  = float(p[0])               # shape (1,)
                label = int(prob >= 0.5)
                print(f"Sample #{i}: {label}  (p={prob:.3f})")
            else:
                label = int(np.argmax(p))
                print(f"Sample #{i}: {label}")
        print()




if __name__ == '__main__':
    load_model_choice = input("Would you like to load a pre-trained model? (y/n): ").strip().lower()
    if load_model_choice == "y":
        filename = input("Enter filename (e.g., my_model.npz): ").strip()
        if not filename.endswith(".npz"):
            filename += ".npz"
        network, config = load_full_model(filename)

        test_choice = input("Would you like to test the loaded model? (y/n): ").strip().lower()
        if test_choice == "y":
            test_model_loop(network)
            exit()

    # User input for network parameters and training data
    output_size = int(input("Enter the number of outputs per sample (e.g., 1 for binary, 3 for 3-class classification): "))

    print("Choose a model setup (activation function + loss function):")
    print("1 - Sigmoid + Mean Squared Error (Good for regression or simple binary classification; not ideal for probabilities)")
    print("2 - Sigmoid + Binary Cross-Entropy (Best for binary classification; outputs are probabilities)")
    print("3 - Tanh + Mean Squared Error (Works for values between -1 and 1; can suffer from vanishing gradients)")
    print("4 - ReLU (hidden) + Sigmoid (output) + Binary Cross-Entropy (Fast and accurate for deeper models)")
    print("5 - ReLU (hidden) + Softmax (output) + Cross-Entropy (Best for multiclass classification)")
    
    model_setup = int(input("Enter the number of your chosen setup (1-5): "))
    config = MODES[model_setup] #relates the integer inputted by user to the actual model setup that is coded
    
    #this helps with printing out the summary of the model
    if model_setup == 1:
        print_model = "Sigmoid + Mean Squared Error"
    elif model_setup == 2:
        print_model = "Sigmoid + Binary Cross-Entropy"
    elif model_setup == 3:
        print_model = "Tanh + Mean Squared Error"
    elif model_setup == 4:
        print_model = "ReLU (hidden) + Sigmoid (output) + Binary Cross-Entropy"    
    elif model_setup == 5:
        print_model = "ReLU (hidden) + Softmax (output) + Cross-Entropy"

        
    input_size = int(input("Enter the number of inputs per sample (if using default dataset, input 3): "))
    
    #bs is the variable that tells us whether or not user wants mini batch
    bs = input("Would you like to use Mini-Batch training? (y/n) ")
    if bs == "y":
        bsize = int(input("How many samples per mini-batch? (eg. 16, 32, 64) "))
    elif bs == "n":
        print("Ok. Model will be trained on each sample, one by one.")
        bsize = 1
    else:
        print("Not a valid answer. Please pick y or n.")
        bs = input("Would you like to use Mini-Batch training? (y/n) ")
        
        
    #do is the variable that tells us whether or not user wants dropout
    do = input("Would you like to use dropout? (y/n) ") 
    if do == "y":
        dropout_rate = float(input("Enter dropout rate (e.g., 0.2 for 20% dropout) "))
    elif do == "n":
        print("Ok. Model will not use dropout and all neurons will be used 100% of the time.")
        dropout_rate = 0.0
    else:
        print("Not a valid answer. Please pick y or n.")
        do = input("Would you like to use dropout? (y/n) ")
    
    print("Choose a weight initialization setup:")
    print("1 - Random weight initialization")
    print("2 - Xavier weight initialization")
    print("3 - He weight initialization")
        
    init_method = int(input("Enter the number of your chosen weight initialization method (1-3): "))
    weight_init_fn = WEIGHT_INITS[init_method] #relates the integer inputted by user to the actual optimization function that is coded
    
    #this helps with printing out the summary of the model
    if init_method == 1:
        init_print = "Random weight initialization"
    elif init_method == 2:
        init_print = "Xavier weight initialization"
    elif init_method == 3:
        init_print = "He weight initialization"
    
    num_layers = int(input("Enter the number of hidden layers: "))
    hidden_size = int(input("Enter the number of hidden neurons: "))
    learn_rate = float(input("Enter the learning rate (e.g., 0.05): "))
    
    print("Choose an optimizer:")
    print("1 - Gradient Descent (Vanilla)")
    print("2 - RMSprop")
    print("3 - Adam")
    optimizer_choice = int(input("Enter the number of your chosen optimizer: "))
    
    #this helps with printing out the summary of the model
    if optimizer_choice == 1:
        print_opt = "Gradient Descent (Vanilla)"
    elif optimizer_choice == 2:
        print_opt = "RMSprop"
    elif optimizer_choice == 3:
        print_opt = "Adam"
    
    epochs = int(input("Enter the number of epochs for training: "))
    use_scheduler = input("Would you like to use a learning rate scheduler? (y/n): ").strip().lower()
    if use_scheduler == 'y':
        use_scheduler = True
    else:
        use_scheduler = False

    #does user want to use default dataset to experiment?
    print("Do you want to use the default dataset? (y/n)")
    use_default = input().strip().lower()
    
    #if they say yes, set what would be the data input to a hard code array of strings.
    if use_default == "y":
        data_lines = [
            "1,2,1",
            "2,4,2",
            "3,3,1",
            "4,5,3",
            "5,5,5",
            "6,4,6",
            "7,6,6",
            "8,7,7",
            "9,8,8",
            "10,9,9",
            "1,1,0",
            "2,2,1",
            "3,1,2",
            "4,2,1",
            "5,3,2",
            "6,2,3",
            "7,3,4",
            "8,4,5",
            "9,5,6",
            "10,6,7",
            "1,0,0",
            "2,1,1",
            "3,2,1",
            "4,3,2",
            "5,4,2",
            "6,5,3",
            "7,5,4",
            "8,6,5",
            "9,7,5",
            "10,8,6"
        ]
        labels_input = "0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,1"
        
        #if they say no, ask user for their data
    else:
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
        
        labels_input = input("\nPaste the labels for each sample, separated by commas: ")

    # Parse the data (valid for both default data and user inputted data)
    data = np.array([[float(value.strip()) for value in line.split(',')] for line in data_lines])
    labels = np.array([float(label.strip()) for label in labels_input.split(',')], dtype=np.float64)

    if model_setup == 5:
        def to_one_hot(index, num_classes):
            one_hot = np.zeros(num_classes)
            one_hot[int(index)] = 1.0
            return one_hot
        labels = np.array([to_one_hot(label, output_size) for label in labels])


      
    #create network
    network = NeuralNetwork(
        input_size,
        hidden_size,
        num_layers,
        output_size,       
        config,
        dropout_rate=dropout_rate if do == "y" else 0,
        init_fn=weight_init_fn,
        optimizer_choice=optimizer_choice
    )
    
    #train the model
    network.train(data, labels, learn_rate=learn_rate, epochs=epochs, bsize=bsize)
    
    #print out the attributes of the model after training to "summarize" it
    print(f"\nTraining complete. The model used:\nMode: {print_model}\nNumber of inputs: {input_size}\nMini-batch size: {bsize}\nDropout rate: {dropout_rate}\nWeight Initialization: {init_print}\nOptimizer function: {print_opt}\nNumber of hidden layers: {num_layers}\nNumber of neurons per layer: {hidden_size}\nLearning rate: {learn_rate}\nLearning rate scheduling: {use_scheduler}\nNumber of epochs: {epochs}")
    
    # Ask the user if they'd like to test the model
    test_choice = input("Would you like to test the model with new data? (y/n): ").strip().lower()
    if test_choice == 'y':
        test_model_loop(network, config)
    else:
        print("Testing skipped. Good job on training your model!")
    
    #ask whether or not they want to save the model
    save_choice = input("Would you like to save the trained model? (y/n): ").strip().lower()
    if save_choice == 'y': 
        filename = input("Enter a filename to save the model (e.g., my_model.npz): ").strip() #if yes then ask for a filename
        if not filename.endswith(".npz"): 
            filename += ".npz"
        network.save_model(
            filename,
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            dropout_rate=dropout_rate if do == "y" else 0,
            optimizer_choice=optimizer_choice,
            mode_id=model_setup,
            bsize=bsize,
            init_id=init_id,
        )
    else:
        print("Model not saved.")

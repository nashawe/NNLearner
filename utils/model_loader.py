import numpy as np
from models.network import NeuralNetwork
from utils.config import MODES
from utils.winit import random_init

def load_full_model(filename):
    data = np.load(filename)

    #gather NN attributes from previously saved file
    input_size = int(data["input_size"])
    hidden_size = int(data["hidden_size"])
    num_layers = int(data["num_layers"])
    dropout_rate = float(data["dropout_rate"])
    optimizer_choice = int(data["optimizer_choice"])
    mode_id = int(data["mode_id"])
    bsize = int(data["batch_size"])
    output_size = int(data["output_size"])

    config = MODES[mode_id] 

    #create an instance of the NeuralNetwork class with the following attributes
    network = NeuralNetwork(
        input_size=input_size,
        hidden_size=hidden_size,
        num_layers=num_layers,
        output_size=output_size,
        config=config,
        dropout_rate=dropout_rate,
        init_fn=random_init,
        optimizer_choice=optimizer_choice
    )

    #basically build back up the network with for loops
    for layer_index, layer in enumerate(network.hidden_layers):
        for neuron_index, neuron in enumerate(layer):
            key_w = f"hidden_{layer_index}_{neuron_index}_weights"
            key_b = f"hidden_{layer_index}_{neuron_index}_bias"
            neuron.weights = data[key_w]
            neuron.bias = data[key_b]

    for i, neuron in enumerate(network.output_layer):
        neuron.weights = data[f"output_{i}_weights"]
        neuron.bias = data[f"output_{i}_bias"]


    print(f"\nModel loaded from {filename}")
    print(f"Model Architecture:\n- Input size: {input_size}\n- Hidden layers: {num_layers}\n- Neurons per layer: {hidden_size}\n- Number of output neurons: {output_size}\n- Dropout rate: {dropout_rate}\n- Optimizer: {optimizer_choice}\n- Mode ID: {mode_id}\n- Batch size: {bsize}")
    
    return network, config
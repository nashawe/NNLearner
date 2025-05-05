import numpy as np
import json
from models.network import NeuralNetwork
from utils.config import MODES
from utils.winit import random_init, xavier_init, he_init

WEIGHT_INITS = {1: random_init, 2: xavier_init, 3: he_init}
OPT_MAP  = {"SGD":1, "RMSProp":2, "Adam":3}

def run_training_from_api(
    input_size,
    output_size,
    hidden_size,
    num_layers,
    dropout,
    optimizer_choice,
    mode_id,
    batch_size,
    learning_rate,
    epochs,
    init_fn,          # int 1-3 from the UI
    data,
    labels,
    save_after_train=False,
    filename="latest_model.npz",
):
    # ------------------------------------------------- config + init
    init_fn = WEIGHT_INITS.get(init_fn)
    config = MODES[mode_id]   
    
    # ------------------------------------------------- for debugging
    print ("config: "+ str(config))
    print("init_fn: "+ str(init_fn))
    print("batch size: " +  str(batch_size))
    print("learning rate: " + str(learning_rate))
    print("epochs: " + str(epochs))
    print("data shape: " + str(np.array(data).shape))
    print("labels shape: " + str(np.array(labels).shape))
    print("input size: " + str(input_size))
    print("output size: " + str(output_size))
    print("hidden size: " + str(hidden_size))
    print("num layers: " + str(num_layers))
    print("dropout: " + str(dropout))
    print("optimizer choice: " + str(optimizer_choice))
    
    # ------------------------------------------------- labels ↔ output_size
    labels  = np.array(labels, dtype=np.float64)
    if labels.ndim == 1:                               # scalar labels → maybe one-hot
        if mode_id == 5:                               # softmax case → one-hot
            n_classes = int(labels.max()) + 1
            labels    = np.eye(n_classes)[labels.astype(int)]
            output_size = n_classes                    # ✅ keep sizes in sync
        else:
            labels = labels.reshape(-1, 1)             # column-vector for binary/regs
            output_size = 1

    labels = np.array(labels, dtype=np.float64)
    if labels.ndim == 2 and labels.shape[1] == 1:
        labels = labels.reshape(-1)

    # ------------------------------------------------- data normalisation
    data = np.array(data, dtype=np.float64)
    if config.get("normalize"):
        mu, sigma = data.mean(axis=0), data.std(axis=0) + 1e-8
        data = (data - mu) / sigma

    # ------------------------------------------------- create + train
    network = NeuralNetwork(
        input_size, hidden_size, num_layers, output_size,
        config, dropout_rate=dropout,
        init_fn=init_fn, optimizer_choice=optimizer_choice,
    )
    batch_size = batch_size or 1                       # default = SGD
    network.train(data, labels,
                  learn_rate=learning_rate,
                  epochs=epochs,
                  bsize=batch_size)

    # ------------------------------------------------- optional save
    if save_after_train:
        network.save_model(
            filename,
            input_size, hidden_size, num_layers,
            dropout_rate=dropout,
            optimizer_choice=optimizer_choice,
            mode_id=mode_id, bsize=batch_size,
        )

    return {
        "message":        "Training complete",
        "samples":        len(data),
        "epochs":         epochs,
        "mode":           mode_id,
        "output_size":    output_size,
        "loss_history":   network.loss_history,
        "accuracy_history": network.accuracy_history,
        **getattr(network, "final_metrics", {}),
    }

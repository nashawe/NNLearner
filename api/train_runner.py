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
    learn_rate,
    epochs,
    init_id,          # int 1-3 from the UI
    data,
    labels,
    save_after_train=False,
    filename="latest_model.npz",
    use_scheduler=False,
    on_epoch_end=None,
):
    # ------------------------------------------------- config + init
    weight_init_fn = WEIGHT_INITS[init_id]     # weight init function
    config = MODES[mode_id]   
    
    # ------------------------------------------------- for debugging
    print("\nBATCH SIZE: " +  str(batch_size))
    print("EPOCHS: " + str(epochs))
    print("DROPOUT: " + str(dropout))
    print("\n-\n")
    print("LEARNING RATE: " + str(learn_rate))
    print("LR SCHEDULER: " + str(use_scheduler))
    print("\n-\n")
    print("FEATURE SHAPE: " + str(np.array(data).shape))
    print("LABELS SHAPE: " + str(np.array(labels).shape))
    print("\n-\n")
    print("INPUT SIZE: " + str(input_size))
    print("OUTPUT SIZE: " + str(output_size))
    print("HIDDEN SIZE: " + str(hidden_size))
    print("NUMBER OF LAYERS: " + str(num_layers))
    print("\n-\n")
    
    if mode_id == 1:
        print("1: sigmoid + MSE\n")
    elif mode_id == 2:
        print("2: sigmoid + BCE\n")
    elif mode_id == 3:
        print("3: tanh + BCE\n")
    elif mode_id == 4:
        print("4: ReLU + Sigmoid + BCE\n")
    elif mode_id == 5:
        print("5: ReLU + softmax + CE\n")
    
    if optimizer_choice == 1:
        print("SGD\n")
    elif optimizer_choice == 2:
        print("RMSProp\n")
    elif optimizer_choice == 3:
        print("Adam\n")

    if init_id == 1:
        print("Random init\n")
    elif init_id == 2:
        print("Xavier init\n")
    elif init_id == 3:
        print("He init\n")
    
    print("Model Training:\n")
    
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
        input_dim=input_size,
        hidden_units=hidden_size,
        hidden_layers_count=num_layers,
        output_dim=output_size,
        mode_cfg=config,
        dropout_rate=dropout,
        init_fn=weight_init_fn,
        optimizer_choice=optimizer_choice,
        use_scheduler=use_scheduler,   # pass the scheduler flag
        learn_rate=learn_rate,         # pass your 0.001 base LR
    )
                    
    network.train(X=data, y=labels, epochs=epochs, batch_size=batch_size, lr_min=1e-4, on_epoch_end=on_epoch_end)


    # ------------------------------------------------- optional save
    
    if save_after_train:
        norm_stats = None               # default: no scaling

        # if the mode asked for z-score normalisation we already computed mu & sigma
        if config.get("normalize"):
            norm_stats = {
                "method": "zscore",
                "mean": mu,
                "std":  sigma
            }

        network.save_model(filename, mode_id, norm_stats)


    return {
        "message":        "Training complete",
        "samples":        len(data),
        "epochs":         epochs,
        "mode":           mode_id,
        "output_size":    output_size,
        "loss_history":   getattr(network, "loss_history", []),
        "accuracy_history": getattr(network, "accuracy_history", []),
        **getattr(network, "final_metrics", {}),
    }


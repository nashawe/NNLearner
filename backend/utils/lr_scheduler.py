import numpy as np

#-------------------------------------------------- learning rate scheduler
def cosine_decay(epoch, epochs, lr_max=0.01, lr_min=0.0001):
    return lr_min + 0.5 * (lr_max - lr_min) * (1 + np.cos(np.pi * epoch / epochs))
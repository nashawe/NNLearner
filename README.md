# Neural Network from Scratch (No External Libraries)

## Overview

This project implements a fully customizable neural network from scratch using NumPy. It provides an in-depth understanding of fundamental neural network operations, including forward propagation, backpropagation, and training with gradient descent. All of this was done without relying on high-level machine learning frameworks like TensorFlow or PyTorch.

The primary goal of this project is to gain a deeper understanding of how neural networks function internally by manually implementing core components.

## 📚 Full Neural Network Explanations

For a full deep dive into how the neural network works behind the scenes — with diagrams, math, and examples — check out this Google Drive folder:

👉 [View Explanations Folder](https://drive.google.com/drive/folders/1VW3BlBr7E5cSYQKeAR7YvYL9XvSm0Nqt)

## Key Features

### Customizable Neural Network Architecture

- Users can configure the neural network structure by selecting the number of inputs, hidden layers, neurons per layer, learning rate, and training epochs.
- Supports multiple activation functions (`sigmoid`, `tanh`, `ReLU`) and loss functions (`mean squared error`, `binary cross-entropy`), with flexible combinations.
- Each component of the network is defined using a modular configuration system, making the design highly extendable.

### Fully Manual, From-Scratch Implementation

- All core mechanisms of a neural network (forward propagation, backpropagation, and gradient descent) are built from scratch using NumPy, without high-level ML libraries.
- The model is constructed using a class-based architecture with a `Neuron` class and a `NeuralNetwork` class, ensuring readability and scalability.
- The training loop includes manual gradient calculations and layer-by-layer weight updates, giving full visibility into how the learning process works.

### Interactive Command-Line Interface

- The application runs entirely through the terminal, where users can input model parameters, paste training data, and enter labels.
- Provides real-time feedback during training by displaying the loss value every 100 epochs.
- After training, users can test the model immediately with new data and receive predictions on the spot.

## Project Structure

This project is modularized into different files to make the project directory more clear.

## Execution of Code

1. Clone the repository:
   ```bash
   git clone https://github.com/nashawe/neural-network.git && cd neural-network
   ```
2. Run the script:

```bash
   python main.py
```

5. Follow the prompts in the console to give the model data and customize it.

## License

This project is open-source and available for learning and development purposes. Feel free to modify and extend it as needed.

## If you find this project valuable, consider starring the repository on GitHub. Thanks for checking it out!

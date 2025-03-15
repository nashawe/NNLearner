# Neural Network from Scratch (No External Libraries)

## Overview
This project implements a fully customizable neural network from scratch using NumPy. It provides an in-depth understanding of fundamental neural network operations, including forward propagation, backpropagation, and training with gradient descent. All of this was done without relying on high-level machine learning frameworks like TensorFlow or PyTorch.

The primary goal of this project is to gain a deeper understanding of how neural networks function internally by manually implementing core components.

## Key Features
### Customizable Neural Network
1. Supports user-defined input size, hidden layer size, learning rate, and epochs.
2. Interactive user input for network parameters and training data.
3. Custom implementation of forward propagation, backpropagation, and gradient descent.

### Object-Oriented Implementation
1. Encapsulation of neurons and network using classes.
2. Neuron class includes a `__call__` method for improved readability and scalability.
3. Modular design, ensuring clarity and maintainability.

### Interactive Training and Evaluation
1. Allows users to input their own training data via console input.
2. Provides real-time feedback on loss reduction over epochs (every 100).
3. Supports testing with custom input data after training completion.

## Project Structure
This project currently has only one python file: `neural_network.py`. 

## Execution of Code
1. Clone the repository:
   ```bash
   git clone https://github.com/nashawe/neural-network.git && cd neural-network
   ```
3. Run the script:
```bash
   python main.py
```
5. Follow the prompts in the console to give the model data and customize it.

## Future Enhancements/Improvements
1. Create support for multiple hidden layers. Currently, the network only supports one hidden layer with as many neurons as the user would like. It would be good to implement a choice on how many layers of neurons are existing, as well
2. Integration of additional activation functions (eg., ReLU, Tanh). It could be interesting to use activation functions other than the sigmoid function in order to optimize the model for certain problems and datasets.
3. Implementation of advanced optimization algorithms (e.g., Adam, RMSprop)

## License
This project is open-source and available for learning and development purposes. Feel free to modify and extend it as needed.

## If you find this project valuable, consider starring the repository on GitHub. Thanks for checking it out!








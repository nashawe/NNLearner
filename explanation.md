# Detailed Explanation/Tuturial of Project
In order to ensure understanding of the concepts behind neural networks, I will format this tutorial in the most simple way possible. Do not feel discouraged if there are some thing that you don't understand right away. Learning is part of the process.

## Notation
Throughout this explanation I will be using the following notations that you should understand before diving into the rest:
1. x(n), where x is the input and n is the input number (For example if there are two different inputs, they would be x(1) and x(2)).
2. w(n), where w is the weight and n is the weight number.
3. b(n), where b is the bias and n is the bias number.
4. y, where y is the output.
5. h(n), where h is the hidden layer neuron and n is the hidden layer neuron number.
6. o(1), where o is the output neuron.
7. n, where n is the number of samples.
8. y_true, where y_true is the known label.
9. y_pred, where y_pred is what the network outputs or "predicts".

## Building Blocks: Neurons
The building blocks of even the most complex neural networks are the individual neurons. 
Neurons take in a certain amount of inputs, and return an (usually one) output. In this explanation, I will use the example of a neuron that takes in two seperate inputs, and returns one single output. 

### Weights and Biases
Neurons use things called weights and bias in order to manipulate the inputs to output an adjusted value. Here is the process behind a neuron:
1. Each input is multipled by its respective weight. If the neuron takes in two inputs, like in this example, there will be two weights used.
       Math: x(n) -> x(n) * w(n)
2. All the weighted inputs are added together with a bias. There is one bias per neuron. NOT per input.
       Example: (x(1) * w(1)) + (x(2) * w(2)) + b
This is basically all the neuron does.

### Activation Function
After the inputs are passed through the core of the neuron and affected by the weights and the biases, that singular value is then passed through an activation function. 
Activation functions, like the sigmoid function, are used to do two things:
1. Squash arbitrary values outputted by the neuron into a range of 0-1.
2. Introduce non-linearity to the network, helping it recognize more complex patterns in data.
In the sigmoid function, large positive values become closer to 1 and large negative numbers become closer to 0. In this way, the outputs are more predictable and their scale is not dependant on the inputs to the neuron.

Sigmoid function is given by:
1 / (1 + e^-x)

### Full Neuron Example:
This example neuron will take in two inputs and have the following parameters:
w = [0, 1] and b = 4    ** The array format of the weights may seem a bit confusing. Basically, it is saying that if we give the inputs in the same form: [x(1), x(2)], the weights will correspond to the inputs they match up with.

Inputs: [2, 3]
        |    |----x(2)
         --- x(1)
Multiply weights with corresponding input and add bias:
(w(1) * x(1) + w(2) * x(2)) + b
== ((0 * 2) + (1 * 3)) + 4
== 3 + 4
== 7
This is the 'raw' output. Now we must pass it through the activation function (sigmoid):


















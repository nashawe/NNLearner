# Detailed Explanation/Tutorial of Project

In order to ensure understanding of the concepts behind neural networks, I will format this tutorial in the most simple way possible. Do not feel discouraged if there are some things that you don't understand right away. Learning is part of the process.

## Notation

Throughout this explanation I will be using the following notations that you should understand before diving into the rest:

1. ![X_n](https://latex.codecogs.com/png.image?\inline&space;\LARGE&space;\dpi{110}\bg{black}x_{n}), where x is the input and n is the input number.
2. ![W_n](https://latex.codecogs.com/png.image?\inline&space;\LARGE&space;\dpi{110}\bg{black}w_{n}), where w is the weight and n is the weight number.
3. ![B_n](https://latex.codecogs.com/png.image?\inline&space;\LARGE&space;\dpi{110}\bg{black}b_{n}), where b is the bias and n is the bias number.
4. y, where y is the output.
5. ![h_n](https://latex.codecogs.com/png.image?\inline&space;\LARGE&space;\dpi{110}\bg{black}h_{n}), where h is the hidden layer neuron and n is the hidden layer neuron number.
6. ![o_1](https://latex.codecogs.com/png.image?\inline&space;\LARGE&space;\dpi{110}\bg{black}o_{1}), where o is the output neuron.
7. n, where n is the number of samples.
8. ![y_true](https://latex.codecogs.com/png.image?\inline&space;\LARGE&space;\dpi{110}\bg{black}y_{true}), where y_true is the known label.
9. ![y_pred](https://latex.codecogs.com/png.image?\inline&space;\LARGE&space;\dpi{110}\bg{black}y_{pred}), where y_pred is what the network outputs or "predicts".

## Building Blocks: Neurons

The building blocks of even the most complex neural networks are the individual neurons.  
Neurons take in a certain amount of inputs, and return an (usually one) output. In this explanation, I will use the example of a neuron that takes in two seperate inputs, and returns one single output.

### Weights and Biases

Neurons use things called weights and bias in order to manipulate the inputs to output an adjusted value. Here is the process behind a neuron:

1. Each input is multiplied by its respective weight. If the neuron takes in two inputs, like in this example, there will be two weights used.  
   Math: ![Equation](https://latex.codecogs.com/png.image?\inline&space;\LARGE&space;\dpi{110}\bg{black}x_{n}=>x_{n}*w_{n})
2. All the weighted inputs are added together with a bias. There is one bias per neuron. NOT per input.  
   Example: ![Equation](<https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}(w_{1}*x_{1}+w_{2}*x_{2})+b>)

Here is a diagram of the neuron process:  
![Single Neuron Diagram](images/single_neuron.png)

This is basically all the neuron does.

### Activation Function

After the inputs are passed through the core of the neuron and affected by the weights and the biases, that singular value is then passed through an activation function.
Activation functions, like the sigmoid function, are used to do two things:

1. Squash arbitrary values outputted by the neuron into a range of 0 to 1.
2. Introduce non-linearity to the network, helping it recognize more complex patterns in data. In the sigmoid function, large positive values become closer to 1 and large negative numbers become closer to 0. In this way, the outputs are more predictable and their scale is not dependant on the inputs to the neuron.

Sigmoid function is given by:  
![Sigmoid Function](https://latex.codecogs.com/png.image?\large&space;\dpi{110}\bg{black}\frac{1}{1+e^{-x}})

### Full Neuron Example:

This example neuron will take in two inputs and have the following parameters:
![weights](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}w=\left[0,1\right]) and ![Bias](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}b=4)  
The array format of the weights may seem a bit confusing. Basically, it is saying that if we give the inputs in the same form: ![inputs](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}\left[x_{1},x_{2}\right]), the weights will correspond to the inputs they match up with.

Inputs = ![inputs](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}\left[2,3\right]), where ![x one](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}x_{1}) = 2 and ![x two](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}x_{2}) = 3:

Multiply weights with corresponding input and add bias:  
=> ![Equation](<https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}(w_{1}*x_{1}+w_{2}*x_{2})+b>)  
=> ![Equation](<https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}((0*2)+(1*3))+4>)  
=> ![Equation](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}3+4)  
=> ![Equation](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}7)

This is the 'raw' output. Now we must pass it through the sigmoid activation function:  
=> ![Sigmoid Function](https://latex.codecogs.com/png.image?\inline&space;\LARGE&space;\dpi{110}\bg{black}\frac{1}{1+e^{-x}})  
=> ![Equation](https://latex.codecogs.com/png.image?\inline&space;\LARGE&space;\dpi{110}\bg{black}\frac{1}{1+e^{-7}})  
=> ![Number](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}0.999)

This is our final output!

This process of passing inputs into a neuron and getting an output back is called `feed forward`. This will be ideal for testing neural networks as it provides their prediction.

When coding this single neuron:

1. Define the activation function we will use (sigmoid) using NumPy.
2. Initialize a class called Neuron so we can easily set its own attributes (weights, bias).
3. Set `self.weights` and `self.bias` to random values.
4. Define the `__call__` method that is the core function of the neuron. This will be called every time there is an instance of the Neuron class:

```python
def __call__(self, x):
    total = np.dot(self.weights, x) + self.bias
    return sigmoid(total)
```

This will make it so that whenever Neuron is called, it will automatically take the inputs and weights and bias and do the usual function.

## Neural Networks: Multiple Neurons

A simple neural network is just a bunch of those neurons connected together. Zooming out from the individual neuron, we can visualize the network like this:

![Neural Network Diagram](images/simple_neural_network.png)

1. ![h1](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{1}), ![h2](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{2}), and ![o1](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}o_{1}) are all neurons with their own independent weights and biases.
2. The inputs for ![o1](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}o_{1}) are the outputs of ![h1](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{1}) and ![h2](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{2}).

The ![h_n](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{n}) neurons are all a part of the hidden layer in the network. The ![o_n](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}o_{n}) neuron is the output neuron that puts it all together to give us one final value.

### Feed Forward Method

This method involves:

1. Passing in inputs as ![x one](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}x_{1}) and ![x two](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}x_{2}) and through the neurons in the **_hidden layer_**.
2. Taking the outputs of ![h1](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{1}) and ![h2](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{2}) and inputing those values into output neuron.
3. Results in a **single** value being outputted.

### Example:

Weights = ![weights](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}\left[0,1\right]) and bias = ![0](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}0)

Hidden Layer:  
![h1](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{1}) = ![h2](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{2}) = ![equation](<https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}(w_{1}*x_{1}+w_{2}*x_{2})+b>)  
=> ![Equation](<https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}(0*2+1*3)+0>)  
=> ![3](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}3)  
Put through sigmoid activation function:  
![h1](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{1}) = ![h2](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{2}) = ![0.953](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}0.953)  
**_It is important to note that the only reason why ![h1](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{1}) = ![h2](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}h_{2}) is because the weights and bias of both of those neurons are the same. If they were not set equally (which they usually aren't), they would not be equal.\_**

Output Neuron:  
![o one](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}o_{1}) = ![Equation](<https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}(w_{1}*x_{1}+w_{2}*x_{2})+b>)  
=> ![equation](<https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}(0*0.953)+(1*0.953)+b>)  
=> ![0.953](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}0.953)  
Put through sigmoid activation function:  
![o one](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}o_{1}) = ![0.7216](https://latex.codecogs.com/png.image?\inline&space;\large&space;\dpi{110}\bg{black}0.7216)

You have just learned a simple neural network! Not so bad right?

When you are ready, continue to the next tutorial to explore more.

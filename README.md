# Simple Neural Network for Number Classification

This repository contains a simple feedforward neural network implemented from scratch using NumPy. The purpose of this project is educational: to help users understand the fundamental workings of neural networks, including forward propagation, backpropagation, and gradient descent. The network is designed to classify handwritten digits from the MNIST dataset.

---

## Table of Contents
[Overview](#overview)
[Dataset]
[Installation]
[Usage]
[Architecture]
[Performance]
[Contributing]
[License]
[Acknowledge]
[Demo]

## Project Overview
This project implements a feedforward neural network from scratch (using only NumPy), trained on the MNIST dataset to classify handwritten digits (0–9). It covers:
- About model:
  - Neural network from scratch (NumPy only)
  - Custom preprocessing: **deslanting**, **intensity**, and **symmetry** features  
  - Trained on image data (flattened 28x28 = 784 pixels)
  - Performance:
      - Train accuracy: 0.9999
      - Validation accuracy: 0.9837
      - Test accuracy: 0.9848
- Other:
  - REST API for inference (`/predict`)  
  - Health check endpoint (`/health`)  
  - Deployable via Flask  

## Dataset
The project uses the MNIST dataset, a standard benchmark for image classification:
- Description: 70,000 grayscale images of handwritten digits (28x28 pixels, labeled 0–9).
- Split: 50,000 training images, 10,000 validation images and 10,000 test images.
- Source: MNIST Dataset
- The dataset is typically accessed via libraries like tensorflow or direct download (`crawl_data.ipynb`). Ensure it is available in the project directory or specify the path in the scripts.

## Installation
To get started, follow these steps:
- Clone the repository:
```bash
git clone https://github.com/pipoiwoczz/Simple-Neural-Network-For-Number-Classification.git
```
- Python version: 3.8+
- Install the required dependencies:
```bash
pip install numpy pickle gzip matplotlib tensorflow flask floask_cors
```

## Usage
- **Run the notebook `model.ipynb`**: to train the model step by step and stored the model's weights as a `.pkl` file for further usage
- **Run the API `model_api.py`**: to run the server api via flask
- **Run the react web**: run `index.js` in directory `mnist-react-app` to run a website for visualization and testing

## Architecture
- **Input layer**: 786 neurons (28x28 flattern images + 2 symmetry and intensity features)
- **Hidden layers**:
  - First layer: 128 neurons with ReLu
  - Second layer: 64 neurons with ReLu
- **Output layer**: 10 neurons (0 - 9 digits) with softmax activation.
- **Loss function**: cross-entropy
- **Optimizer**: mini-batch gradient desclent with `lr = 0.3` and `batch_size = 32`
- **Max_epoch**: 50 epochs
- **Code Snippet**:
```python
# Define the neural network
hid_layer_sizes = [128, 64]
initial_Ws = None
mb_size = 32
lr = 0.3
max_epoch = 50

# Train the neural network
Ws, ces = train_nnet(train_Z, train_Y, hid_layer_sizes, initial_Ws, mb_size, lr, max_epoch)
```

## Performance
- The neural network achieves high performance on the `MNIST` dataset:
    - **Train accuracy**: 0.9999
    - **Validation accuracy**: 0.9837
    - **Test accuracy**: 0.9848
 - These results indicate excellent generalization, with minimal overfitting, as the validation and test accuracies are close to the training accuracy.
 - The high training accuracy (99.99%) suggests the model fits the training data well, while the slightly lower validation and test accuracies (98.37% and 98.48%) indicate robust generalization. For comparison, advanced architectures like convolutional neural networks (CNNs) can achieve over 99% accuracy on MNIST. To further improve performance, consider experimenting with regularization (e.g., dropout) or advanced optimizers (e.g., Adam).

## Acknowledge
- [MNIST Dataset]
- [CSC14005 – Introduction to Machine Learning] VNU-University of Science (HCMUS)

## Demo


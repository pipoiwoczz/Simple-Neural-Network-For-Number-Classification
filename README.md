# Simple Neural Network for Number Classification

**Manual NumPy-based neural network for MNIST handwritten digit recognition.**

---

## 🎯 Project Overview
This project implements a feedforward neural network from scratch (using only NumPy), trained on the MNIST dataset to classify handwritten digits (0–9). It covers:
- Forward propagation
- Backpropagation with gradient descent
- Parameter saving/loading
- Performance evaluation (accuracy, loss plots)

---

## 🧠 Network Architecture & Hyperparameters

| Layer           | Size        | Activation |
|------------------|-------------|-------------|
| Input           | 784 (28×28) | –           |
| Hidden Layer 1  | 200 neurons | ReLU        |
| Hidden Layer 2  | 100 neurons | ReLU        |
| Hidden Layer 3  | 50  neurons | ReLU        |
| Output          | 10 neurons  | Softmax     |

- **Loss**: Cross-entropy  
- **Optimizer**: Gradient descent  
- **Learning rate (α)**: [e.g. 0.01]  
- **Batch size**: [e.g. 64]  
- **Epochs**: [e.g. 20]

---

## 🛠️ Setup & Usage

```bash
git clone https://github.com/pipoiwoczz/Simple-Neural-Network-For-Number-Classification.git
cd Simple-Neural-Network-For-Number-Classification
pip install -r requirements.txt
python train.py        # to train the model
python evaluate.py     # to test & visualize performance
python predict.py      # to input a custom image for prediction

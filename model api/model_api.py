from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import pickle

app = Flask(__name__)
CORS(app)

# compute the symmetry and intensity of the image
# compute intensity
def compute_intensity(X):
    return np.mean(X, axis=1)

# compute symmetry
def compute_symmetry(X):
    data_num = X.shape[0]

    # reshape the images for calculating symmetry
    images = X.reshape(-1, 28, 28)

    # symmetry = (vertical_symmetry + horizontal_symmetry) / 2
    # vertical symmetry and horizontal symmetry
    vertical_symmetry = np.zeros(data_num)
    horizontal_symmetry = np.zeros(data_num)

    # compute symmetry
    for i in range(data_num):
        img = images[i]
        # vertical symmetry = difference between image and up-down flipped image
        vertical_symmetry[i] = np.mean(np.abs(img - np.flipud(img)))
        # horizontal symmetry = difference between image and left-right flipped image
        horizontal_symmetry[i] = np.mean(np.abs(img - np.fliplr(img)))
    
    symmetries = (vertical_symmetry + horizontal_symmetry) / 2
    return symmetries

# compute the output of the neural network
def compute_nnet_output(Ws, X, return_what="class"):
    """
    Compute the output of the neural network
    :param Ws: list of weight matrices
    :param X: input data
    :param return_what: what to return (class, probability or all)
    
    """

    def sigmoid(z):
        return 1 / (1 + np.exp(-z))
    
    def softmax(z):
        exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)

    A = X
    As = [A]
    
    for W in Ws[:-1]:
        Z = A.dot(W)
        A = sigmoid(Z)
        A = np.hstack((np.ones((A.shape[0], 1)), A))
        As.append(A)
    
    Z = A.dot(Ws[-1])
    A = softmax(Z)
    As.append(A)
    
    if return_what == 'all':
        return As
    elif return_what == 'prob':
        return A
    else:
        return np.argmax(A, axis=1)

# deslant the image
def deslant(X):
    # intialize the desclanted images
    deslanted_images = np.zeros_like(X)

    # desclant the images
    # loop through each image
    for i in range(X.shape[0]):
        img = X[i].reshape(28, 28)
        # find significant pixels (pixel value > 0.5)
        significant_pixels = np.argwhere(img > 0.5)

        # check if there are any significant pixels
        if len(significant_pixels) == 0:
            deslanted_images[i] = X[i]  # if no significant pixels, keep the image as it is
            continue

        # find the center of the significant pixels
        center = np.mean(significant_pixels, axis=0)

        # normalize the significant pixels
        normalized_pixels = (significant_pixels - center) / np.std(significant_pixels, axis=0)

        # shift the significant pixels
        tan_a = - np.corrcoef(normalized_pixels[:, 0], normalized_pixels[:, 1])[0, 1] * np.std(significant_pixels[:, 1], axis=0) / np.std(significant_pixels[:, 0], axis=0)
        for row in range (28):
            for col in range(28):
                ic = col + tan_a * (center[0] - row)
                if ic < 0:
                    ic = 0
                if ic > 27:
                    ic = 27
                ic_up = int(ic) + 1
                ic_down = int(ic)
                if ic_up > 27:
                    ic_up = 27
                con = ic_up - ic
                deslanted_images[i, row * 28 + col] = con * img[row, ic_down] + (1 - con) * img[row, ic_up]

    return deslanted_images

# Load the model
def load_model(filename="custom_model.pkl"):
    with open(filename, "rb") as f:
        Ws = pickle.load(f)
    print(f"Model loaded from {filename}")
    return Ws

#deslant the image
def deslant_image(image):
    # Compute the center of mass of the image
    center_of_mass = np.array([0, 0])
    mass = 0
    for i in range(image.shape[0]):
        for j in range(image.shape[1]):
            center_of_mass += np.array([i, j]) * image[i, j]

# preprocess the input data
def preprocess_input(data):
    symmetries = compute_symmetry(data).reshape(-1, 1)
    intensities = compute_intensity(data).reshape(-1, 1)

    data = deslant(data)

    # Concatenate the features
    image = np.hstack((np.ones((data.shape[0], 1)), data, intensities, symmetries))
    return image
    

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json.get('image', [])
        if not data or len(data) != 784:
            return jsonify({"error": "Invalid image data. Expected 784-length list."}), 400

        image = preprocess_input(np.array(data).reshape(1, -1))
        Ws = load_model()
        prediction = compute_nnet_output(Ws, image, "class")

        return jsonify({"digit": int(prediction[0])})

    except ValueError as ve:
        return jsonify({"error": f"Value Error: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

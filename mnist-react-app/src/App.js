import React, { useState } from 'react';
import DigitCanvas from './component/digit_canvas';
import './App.css';

const predictAPI = 'http://localhost:5000/predict';

const App = () => {
  const [prediction, setPrediction] = useState(null); // Store the prediction result
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const handleSubmit = async (pixels) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(predictAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: pixels }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrediction(null); // Clear prediction
    setError(null); // Clear error
  };

  return (
    <div className="App">
      <h1>MNIST Digit Classifier</h1>
      <DigitCanvas onSubmit={handleSubmit} onClear={handleClear} />
      
      {/* Display loading state */}
      {loading && <p className="loading">Predicting...</p>}

      {/* Display error message */}
      {error && <p className="error">{error}</p>}

      {/* Display prediction result */}
      {prediction && (
        <div className="prediction-result">
          <h2>Prediction Result</h2>
          <p>Predicted Digit: <strong>{prediction.digit}</strong></p>
          <p>Confidence: <strong>{(prediction.confidence * 100).toFixed(2)}%</strong></p>
        </div>
      )}
    </div>
  );
};

export default App;
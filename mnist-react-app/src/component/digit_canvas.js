import React, { useRef, useState, useEffect } from 'react';

const DigitCanvas = ({ onSubmit }) => {
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null); // Ref for the 28x28 preview canvas
  const [drawing, setDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(10); // Default brush size

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Set background to black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e) => {
    setDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const draw = (e) => {
    if (!drawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = 'white'; // Brush color
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black'; // Reset to black background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear the preview canvas
    const previewCtx = previewCanvasRef.current.getContext('2d');
    previewCtx.fillStyle = 'black';
    previewCtx.fillRect(0, 0, 28, 28);
  };

  const convertTo28x28 = () => {
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Set temporary canvas size to 28x28
    tempCanvas.width = 28;
    tempCanvas.height = 28;

    // Resize the drawn image to 28x28
    tempCtx.drawImage(canvas, 0, 0, 28, 28);

    // Get pixel data from the resized canvas
    const imageData = tempCtx.getImageData(0, 0, 28, 28);
    const data = imageData.data;

    // Convert to grayscale and normalize to [0, 1]
    let pixels = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];     // Red
      const g = data[i + 1]; // Green
      const b = data[i + 2]; // Blue
      const gray = (r + g + b) / 3; // Convert RGB to grayscale
      pixels.push(gray / 255.0); // Normalize to [0, 1]
    }

    console.log("Converted 28x28 Data:", pixels);

    // Draw the 28x28 image on the preview canvas
    drawPreview(pixels);

    // Pass the preprocessed data to the parent component
    if (onSubmit) {
      onSubmit(pixels);
    }
  };

  const drawPreview = (pixels) => {
    const previewCanvas = previewCanvasRef.current;
    const previewCtx = previewCanvas.getContext('2d');

    // Clear the preview canvas
    previewCtx.fillStyle = 'black';
    previewCtx.fillRect(0, 0, 28, 28);

    // Draw the 28x28 image
    const imageData = previewCtx.createImageData(28, 28);
    for (let i = 0; i < pixels.length; i++) {
      const gray = Math.round(pixels[i] * 255); // Scale back to [0, 255]
      const index = i * 4;
      imageData.data[index] = gray;     // Red
      imageData.data[index + 1] = gray; // Green
      imageData.data[index + 2] = gray; // Blue
      imageData.data[index + 3] = 255;  // Alpha (fully opaque)
    }
    previewCtx.putImageData(imageData, 0, 0);
  };

  return (
    <div style={{ textAlign: 'center', color: 'white', background: '#222', padding: '20px' }}>
      <h2>Draw a Digit</h2>
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        style={{
          border: '1px solid white',
          background: 'black',
          width: '280px',
          height: '280px',
          cursor: 'crosshair'
        }}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
      />
      <div style={{ marginTop: '10px' }}>
        <label>Brush Size: {brushSize}</label>
        <input 
          type="range" 
          min="1" 
          max="30" 
          value={brushSize} 
          onChange={(e) => setBrushSize(Number(e.target.value))}
          style={{ marginLeft: '10px' }}
        />
      </div>
      <button onClick={clearCanvas} style={{ marginTop: '10px', marginRight: '10px' }}>Clear</button>
      <button onClick={convertTo28x28} style={{ marginTop: '10px' }}>Submit</button>

      {/* Preview Canvas for 28x28 Image */}
      <div style={{ marginTop: '20px' }}>
        <h3>28x28 Preview</h3>
        <canvas
          ref={previewCanvasRef}
          width={28}
          height={28}
          style={{
            border: '1px solid white',
            background: 'black',
            width: '112px', // Scale up for better visibility
            height: '112px',
            imageRendering: 'pixelated' // Preserve pixelation
          }}
        />
      </div>
    </div>
  );
};

export default DigitCanvas;
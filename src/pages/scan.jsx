import React, { useState, useRef } from "react";

const SmartReceipts = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Open camera
  const startCamera = async () => {
    setStep(2); // Move to camera step
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Camera access denied", error);
    }
  };

  // Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Draw video frame onto canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data URL
    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);

    // Stop the camera
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    setStep(3); // Move to processing step
    processCapturedImage(imageData);
  };

  // Process the captured image on the server
  const processCapturedImage = async (imageDataUrl) => {
    try {
      const blob = await fetch(imageDataUrl).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", blob, "receipt.png");

      const response = await fetch(
        "https://frontend-datamesh.onrender.com/process-invoice/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const result = await response.json();
      setData({
        store: result.store || "Unknown",
        amount: result.amount || "Unknown",
        date: result.date || "Unknown",
        items: result.items || [],
        category: result.category || "Uncategorized",
        timeFrame: result.timeFrame || "Unknown",
      });
      setStep(4); // Move to results step
    } catch (error) {
      console.error("Error processing receipt:", error);
      setStep(1); // Reset to scanning on failure
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-4xl font-extrabold text-center">
        📄 Smart Digital Receipts
      </h1>

      {/* Step 1: Start Scanning */}
      {step === 1 && (
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-center space-y-6 animate-fade-in">
          <h2 className="text-2xl font-semibold">Scan Your Receipt</h2>
          <p className="text-gray-300">
            Use your smartphone camera to digitize paper receipts.
          </p>
          <button
            onClick={startCamera}
            className="bg-teal-500 text-white py-2 px-6 rounded-full hover:bg-teal-600 transition"
          >
            Start Scanning
          </button>
        </div>
      )}

      {/* Step 2: Camera Access */}
      {step === 2 && (
        <div className="bg-blue-800 p-4 rounded-lg shadow-lg text-center animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4">Capture Your Receipt</h2>
          <video ref={videoRef} className="w-full h-64 bg-black mb-4"></video>
          <button
            onClick={capturePhoto}
            className="bg-teal-500 text-white py-2 px-6 rounded-full hover:bg-teal-600 transition"
          >
            Capture Receipt
          </button>
        </div>
      )}

      {/* Step 3: Processing */}
      {step === 3 && (
        <div className="text-center space-y-4 animate-fade-in">
          <p className="text-lg font-semibold">🔄 Processing your receipt...</p>
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">
            Extracting details and classifying categories with AI.
          </p>
        </div>
      )}

      {/* Step 4: Display Results */}
      {step === 4 && data && (
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg max-w-md space-y-4 animate-fade-in">
          <h2 className="text-2xl font-semibold">Receipt Details</h2>

          {/* Captured Image */}
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured Receipt"
              className="rounded-lg mb-4"
            />
          )}

          <div className="space-y-2">
            <p>
              <span className="font-bold">🛒 Store:</span> {data.store}
            </p>
            <p>
              <span className="font-bold">💵 Amount:</span> {data.amount}
            </p>
            <p>
              <span className="font-bold">📅 Date:</span> {data.date}
            </p>
            <p>
              <span className="font-bold">📂 Category:</span> {data.category}
            </p>
            <p>
              <span className="font-bold">🕒 Time Frame:</span> {data.timeFrame}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">📝 Items</h3>
            <ul className="list-disc list-inside text-gray-300">
              {data.items.map((item, index) => (
                <li key={index}>
                  {item.name} - <span className="font-semibold">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => {
              setStep(1);
              setData(null);
              setCapturedImage(null);
            }}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full transition w-full"
          >
            Scan Another Receipt
          </button>
        </div>
      )}

      <footer className="text-center text-gray-400 text-sm">
        Powered by OCR + AI Classification 🌟
      </footer>

      {/* Hidden Canvas for Capturing Photo */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default SmartReceipts;
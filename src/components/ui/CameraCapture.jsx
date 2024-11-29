import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Camera, X } from 'lucide-react';

function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      onCapture(file);
    }, 'image/jpeg');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-2xl w-full mx-4">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={captureImage}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Camera className="mr-2 h-5 w-5" />
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}

CameraCapture.propTypes = {
  onCapture: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CameraCapture;
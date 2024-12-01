import React, { useState } from 'react';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import crypto from 'crypto';

const SHDW_DRIVE_ENDPOINT = "https://shadow-storage.genesysgo.net"; // API Endpoint for uploading
const STORAGE_ACCOUNT_PUBLIC_KEY = ""; // We'll populate this after creating the storage account

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState("");
  const [message, setMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [storageAccount, setStorageAccount] = useState(""); // To store the new storage account info

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Generate message and signature for the file upload
  const generateSignature = (fileName) => {
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileName);
    const fileNameHash = hashSum.digest("hex");

    const msg = `Shadow Drive Signed Message:\nStorage Account: ${STORAGE_ACCOUNT_PUBLIC_KEY}\nUpload files with hash: ${fileNameHash}`;
    setMessage(msg);

    const encodedMessage = new TextEncoder().encode(msg);
    const signedMessage = nacl.sign.detached(encodedMessage, keypair.secretKey); // Replace `keypair` with actual keypair
    const signature = bs58.encode(signedMessage);

    setSignature(signature);
  };

  // Function to create a new storage account
  const createStorageAccount = async () => {
    try {
      // Step 1: Generate transaction data for creating the storage account
      const transactionData = generateCreateStorageAccountTransaction(); // Implement this function

      // Step 2: Partially sign the transaction
      const signedTransaction = signTransaction(transactionData); // Implement this function

      // Here we skip sending the request to create the storage account as per your instructions
      // This part would involve communicating with the storage service

      setStorageAccount("uniqueStorageAccountID"); // Placeholder storage account ID
      setUploadStatus(`Storage account created successfully: ${storageAccount}`);
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  // Function to generate the create storage account transaction (customize as per your requirements)
  const generateCreateStorageAccountTransaction = () => {
    // Replace this with the actual logic for generating the transaction
    const transaction = {
      // Define the necessary fields for your transaction
    };
    return transaction;
  };

  // Function to sign the transaction (customize as per your requirements)
  const signTransaction = (transaction) => {
    // Sign the transaction using your private key (replace with actual signing logic)
    const signedTransaction = nacl.sign.detached(new TextEncoder().encode(JSON.stringify(transaction)), keypair.secretKey);
    return bs58.encode(signedTransaction);
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !signature || !storageAccount) {
      alert("Please provide a file, signature, and a storage account.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("message", signature);
    formData.append("signer", keypair.publicKey.toString());  // Replace with actual publicKey
    formData.append("storage_account", storageAccount); // Use created storage account

    try {
      const response = await fetch(`${SHDW_DRIVE_ENDPOINT}/upload`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        setUploadStatus(`File uploaded successfully: ${JSON.stringify(result)}`);
      } else {
        setUploadStatus(`Upload failed: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-100 p-6 max-w-xl mx-auto rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Share to Earn: Upload Your Invoice</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">About ShadowDrive</h3>
        <p className="text-gray-600">
          ShadowDrive offers a secure, decentralized storage platform for your files. By uploading invoices, you can earn rewards, while keeping your data protected.
        </p>
      </div>

      <button
        onClick={createStorageAccount}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none mb-4"
      >
        Create Storage Account
      </button>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label htmlFor="file" className="block text-gray-700 font-semibold">Select File to Upload:</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-gray-700 font-semibold">Message to Sign:</label>
          <textarea
            id="message"
            value={message}
            readOnly
            rows="4"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => generateSignature(file?.name)}
            className="w-1/2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Generate Signature
          </button>
          <button
            type="submit"
            className="w-1/2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none"
          >
            Upload File
          </button>
        </div>
      </form>

      {uploadStatus && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-800">Upload Status:</h4>
          <pre className="text-gray-700 mt-2">{uploadStatus}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadFile;

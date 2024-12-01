import React, { useState } from 'react';
import { Share2, TrendingUp, Shield } from 'lucide-react';
import { create } from 'ipfs-http-client';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

const InvoiceUpload = () => {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
    }
  };

  const uploadToIPFS = async () => {
    if (!file) {
      alert('Please select a file!');
      return;
    }
    setUploading(true);
    try {
      const ipfs = await create();
      const { cid } = await ipfs.add(file);
      const generatedLink = `https://ipfs.io/ipfs/${cid}`;
      setLink(generatedLink);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
    setUploading(false);
  };

  const signAndSubmit = async () => {
    if (!publicKey || !link) {
      alert('Please connect your wallet and upload a file first!');
      return;
    }

    try {
      const transaction = new Transaction().add(
        // Example instruction: Replace with your actual Solana smart contract logic
        {
          keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
          programId: new PublicKey('YOUR_PROGRAM_ID'),
          data: Buffer.from(link), // Sending the IPFS link to the program
        }
      );

      const signature = await sendTransaction(transaction);
      alert(`Transaction submitted! Signature: ${signature}`);
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Failed to submit transaction.');
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={uploadToIPFS}
        disabled={uploading}
        className={`w-full px-4 py-2 text-white font-semibold rounded-md ${
          uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload to IPFS'}
      </button>
      {link && (
        <div className="space-y-2">
          <p className="text-sm text-gray-700">File Link:</p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-500 underline"
          >
            {link}
          </a>
          <button
            onClick={signAndSubmit}
            className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
          >
            Sign & Submit to Solana
          </button>
        </div>
      )}
    </div>
  );
};

const Share = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Invoices, Earn Rewards
          </h1>
          <p className="text-lg text-gray-600">
            Upload your invoice bills securely to our decentralized storage and earn rewards
            for contributing to our community database.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <Shield className="w-8 h-8 text-blue-500" />,
              title: 'Secure Storage',
              description: 'Your invoices are stored on decentralized IPFS network',
            },
            {
              icon: <Share2 className="w-8 h-8 text-green-500" />,
              title: 'Easy Sharing',
              description: 'Share your invoices with anyone using a simple link',
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
              title: 'Earn Rewards',
              description: 'Get rewarded for contributing to our invoice database',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Upload Your Invoice
          </h2>
          <InvoiceUpload />
        </div>
      </div>
    </div>
  );
};

export default Share;

import React, { useState } from "react";

const ConnectWallet = () => {
  const [step, setStep] = useState(1);
  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const dummyAvatars = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4",
  ];

  // Simulate wallet connection
  const handleConnectWallet = () => {
    setStep(2); // Go to profile creation step
    setWalletAddress("0x1234...abcd"); // Mock wallet address
  };

  // Complete profile creation
  const handleCompleteProfile = () => {
    setStep(3); // Go to profile confirmation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-4xl font-extrabold text-center">🦊 Connect Wallet</h1>

      {/* Step 1: Connect Wallet */}
      {step === 1 && (
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-center space-y-6 animate-fade-in">
          <h2 className="text-2xl font-semibold">Connect Your Wallet</h2>
          <p className="text-gray-300">
            Connect your crypto wallet to start creating your profile.
          </p>
          <button
            onClick={handleConnectWallet}
            className="bg-teal-500 text-white py-2 px-6 rounded-full hover:bg-teal-600 transition"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {/* Step 2: Profile Creation */}
      {step === 2 && walletAddress && (
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg max-w-md text-center space-y-6 animate-fade-in">
          <h2 className="text-2xl font-semibold">Create Your Profile</h2>
          <p className="text-gray-300">
            Wallet Connected: <span className="font-mono">{walletAddress}</span>
          </p>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Choose Your Avatar</h3>
            <div className="grid grid-cols-2 gap-4">
              {dummyAvatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-20 h-20 rounded-full cursor-pointer border-4 ${
                    selectedAvatar === avatar
                      ? "border-teal-500"
                      : "border-transparent"
                  } hover:scale-110 transition`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={handleCompleteProfile}
            className="bg-teal-500 text-white py-2 px-6 rounded-full hover:bg-teal-600 transition"
            disabled={!selectedAvatar}
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* Step 3: Profile Confirmation */}
      {step === 3 && selectedAvatar && (
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg max-w-md text-center space-y-6 animate-fade-in">
          <h2 className="text-2xl font-semibold">Profile Created! 🎉</h2>
          <img
            src={selectedAvatar}
            alt="Selected Avatar"
            className="w-32 h-32 rounded-full mx-auto border-4 border-teal-500"
          />
          <p className="text-gray-300">
            Wallet Address: <span className="font-mono">{walletAddress}</span>
          </p>
          <p className="text-lg">
            Welcome! Your profile has been successfully created.
          </p>
          <button
            onClick={() => setStep(1)} // Reset to connect wallet
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full transition w-full"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;

import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const ConnectWallet = () => {
  const { publicKey, disconnect } = useWallet();
  const [avatar, setAvatar] = useState("");

  // Generate random avatar using DiceBear API
  useEffect(() => {
    if (publicKey) {
      const randomSeed = publicKey.toString().substring(0, 10); // Unique seed from public key
      setAvatar(`https://avatars.dicebear.com/api/avataaars/${randomSeed}.svg`);
    }
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-800 to-sky-900 flex flex-col items-center justify-center text-white px-6">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 text-center w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-sky-300">
          🔑 Wallet Connection
        </h1>
        {publicKey ? (
          <div>
            <img
              src={avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto border-4 border-sky-400 mb-4"
            />
            <p className="text-sm text-gray-400 mb-4 break-all">
              Wallet Connected:
              <span className="block font-mono mt-2">{publicKey.toString()}</span>
            </p>
            <button
              onClick={disconnect}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-6 text-gray-400">Connect your wallet to get started.</p>
            <WalletMultiButton className="!bg-sky-600 !text-white !hover:bg-sky-700 !transition !w-full justify-center" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;

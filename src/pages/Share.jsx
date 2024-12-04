import React, { useState } from 'react';
import { Share2, TrendingUp, Shield } from 'lucide-react';
import { PublicKey, Transaction, SystemProgram, Connection } from '@solana/web3.js';
import { FleekSdk, ApplicationAccessTokenService } from '@fleek-platform/sdk';
import { WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from "@project-serum/anchor";
import CryptoJS from "crypto-js";
import BN from 'bn.js';
import idl from '../assets/idl/den.json';

export const DEN_PROGRAM_INTERFACE = JSON.parse(JSON.stringify(idl));

const calculateInvoiceDataHashId = (input) => {
    const hash = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
    // Take the first 16 characters (8 bytes) from the hash and convert to BN
    const u64Hex = hash.slice(0, 16); // First 8 bytes (16 hex characters)
    const u64 = new BN(u64Hex, 16); // Convert from hex to BN
    return u64;
};

const network = "https://api.devnet.solana.com";

const programId = new PublicKey(import.meta.env.VITE_SOL_PROGRAM_ID_DEVNET);

const InvoiceUpload = () => {
    const [file, setFile] = useState(null);
    const [link, setLink] = useState('');
    const [uploading, setUploading] = useState(false);
    const { publicKey, sendTransaction } = useWallet();

    const wallet = useWallet(); // Access the connected wallet
    const [formData, setFormData] = useState({
        invoiceData: "",
        hsnNumber: "",
        amount: 0,
        quantity: 0,
        timestamp: 0,
        imageProof: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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
            const applicationService = new ApplicationAccessTokenService({
                clientId: import.meta.env.VITE_FLEEKXYZ_CLIENT_ID,
            });
            const fleekSdk = new FleekSdk({
                accessTokenService: applicationService
            });
            const result = await fleekSdk.storage().uploadFile({
                file,
            });
            let cid = result.pin.cid
            let link = "https://" + cid + ".ipfs.flk-ipfs.xyz/"
            console.log("link to the uploaded file: " + link)
            alert('File uploaded successfully!');
            setLink(link)

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        }
        setUploading(false);
    };

    const signAndSubmit = async () => {
        try {
            if (!wallet || !wallet.connected) {
                alert("Please connect your wallet!");
                return;
            }

            const connection = new anchor.web3.Connection(network, "processed");
            const provider = new anchor.AnchorProvider(connection, wallet, {
                preflightCommitment: "processed",
            });
            anchor.setProvider(provider);
            console.log("provider:", provider)

            // Load the program
            const program = new anchor.Program(DEN_PROGRAM_INTERFACE, programId, provider);


            const { invoiceData, hsnNumber, amount, quantity, timestamp, imageProof } =
                formData;

            if (!invoiceData) {
                alert("Invoice data is missing!");
                return;
            }
            console.log("INVOICE DATA: " + invoiceData)
            const invoiceDataHashId = calculateInvoiceDataHashId(invoiceData);
            console.log("Invoice Data Hash ID:", invoiceDataHashId.toString());

            let [economic_data_account] = anchor.web3.PublicKey.findProgramAddressSync(
                [
                    Buffer.from("economic_data"),
                    wallet.publicKey.toBuffer(),
                    new BN(invoiceDataHashId).toArrayLike(Buffer, "le", 8)
                ],
                program.programId
            );

            const tx = await program.methods
                .submitEconomicData(
                    invoiceDataHashId,
                    invoiceData,
                    hsnNumber,
                    new anchor.BN(amount), // Amount (u64)
                    quantity, // Quantity (u32)
                    new anchor.BN(timestamp), // Timestamp (i64)
                    imageProof
                )
                .accounts({
                    economicDataAccount: economic_data_account,
                    authority: wallet.publicKey,
                })
                .rpc();

            console.log("Transaction:", tx);
            alert("Data submitted successfully! Transaction: " + tx);
        } catch (error) {
            console.error("Error submitting economic data:", error);
            alert("Error: " + error.message);
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
                className={`w-full px-4 py-2 text-white font-semibold rounded-md ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
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


                    <form className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="invoiceData" className="text-sm text-gray-600">
                                Invoice Data
                            </label>
                            <input
                                id="invoiceData"
                                type="text"
                                name="invoiceData"
                                placeholder="Invoice Data"
                                value={formData.invoiceData}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="hsnNumber" className="text-sm text-gray-600">
                                HSN Number
                            </label>
                            <input
                                id="hsnNumber"
                                type="text"
                                name="hsnNumber"
                                placeholder="HSN Number"
                                value={formData.hsnNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="amount" className="text-sm text-gray-600">
                                Amount
                            </label>
                            <input
                                id="amount"
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="quantity" className="text-sm text-gray-600">
                                Quantity
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="timestamp" className="text-sm text-gray-600">
                                Timestamp
                            </label>
                            <input
                                id="timestamp"
                                type="datetime-local"
                                name="timestamp"
                                placeholder="Timestamp"
                                value={new Date(formData.timestamp).toISOString().slice(0, 16)} // Convert timestamp to "yyyy-MM-ddTHH:mm"
                                onChange={(e) =>
                                    setFormData({ ...formData, timestamp: new Date(e.target.value).getTime() })
                                }
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="imageProof" className="text-sm text-gray-600">
                                Image Proof URL
                            </label>
                            <input
                                id="imageProof"
                                type="text"
                                name="imageProof"
                                placeholder="Image Proof URL"
                                value={formData.imageProof}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                    </form>                    <button
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

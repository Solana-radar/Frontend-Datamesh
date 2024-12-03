import React, { useState } from 'react';
import { Share2, TrendingUp, Shield } from 'lucide-react';
import { PublicKey, Transaction, SystemProgram, Connection } from '@solana/web3.js';
import { FleekSdk, ApplicationAccessTokenService } from '@fleek-platform/sdk';
import { WalletProvider, useWallet } from '@solana/wallet-adapter-react';
//import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import * as anchor from "@project-serum/anchor";
import idl from '../assets/idl/den.json';


// Create a connection to the Solana Devnet
const network = "https://api.devnet.solana.com";
const connection = new Connection(network);

//const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
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

    const submitData = async () => {
        try {
            const [simplePDA] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from('simpleSeed')],
                programId
            );
            console.log(simplePDA.toString());
            // Ensure wallet is connected
            if (!wallet || !wallet.connected) {
                alert("Please connect your wallet!");
                return;
            }

            // Initialize connection and provider
            const connection = new anchor.web3.Connection(network, "processed");
            const provider = new anchor.AnchorProvider(connection, wallet, {
                preflightCommitment: "processed",
            });
            anchor.setProvider(provider);

            // Load the program
            //const idl = await anchor.Program.fetchIdl(programId, provider);
            const program = new anchor.Program(idl, programId, provider);

            const { invoiceData, hsnNumber, amount, quantity, timestamp, imageProof } =
                formData;

            if (!invoiceData) {
                alert("Invoice data is missing!");
                return;
            }
            console.log("INVOICE DATA: " + invoiceData)

            // Generate the PDA
            const [uncheckedEconomicDataEntry] =
                await anchor.web3.PublicKey.findProgramAddress(
                    [Buffer.from("seed", 'utf-8')],
                    programId
                );

            // Send the transaction
            const tx = await program.methods
                .submitEconomicData(
                    formData.invoiceData,
                    hsnNumber,
                    new anchor.BN(amount), // Amount (u64)
                    quantity, // Quantity (u32)
                    new anchor.BN(timestamp), // Timestamp (i64)
                    imageProof
                )
                .accounts({
                    user: wallet.publicKey,
                    uncheckedEconomicDataEntry,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            console.log("Transaction successful:", tx);
            alert("Data submitted successfully! Transaction ID: " + tx);
        } catch (error) {
            console.error("Error submitting economic data:", error);
            alert("Error: " + error.message);
        }
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

    const signAndSubmitTest1 = async () => {
        const { publicKey, sendTransaction } = useWallet();

        if (!publicKey) {
            alert("Please connect your Phantom wallet first!");
            return;
        }

        try {
            setLoading(true);

            // Your Solana program's public key (replace with your deployed program ID)
            const programId = new PublicKey("YOUR_SOLANA_PROGRAM_ID");

            // Example of interacting with the program by creating a simple transaction
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey("RECIPIENT_PUBLIC_KEY"), // Change this to your recipient's public key
                    lamports: 1000000000, // Amount of SOL to transfer (1 SOL = 10^9 lamports)
                })
            );

            // Send the transaction
            const txHash = await sendTransaction(transaction, connection);
            console.log("Transaction sent with hash:", txHash);

            // Optionally confirm the transaction if needed
            const confirmation = await connection.confirmTransaction(txHash, 'processed');
            console.log("Transaction confirmed:", confirmation);

            setLoading(false);
        } catch (error) {
            console.error("Error triggering program:", error);
            setLoading(false);
        }
    };

    const triggerSolanaProgramTest2 = async () => {
        const { publicKey, sendTransaction } = useWallet();

        if (!publicKey) {
            alert("Please connect your Phantom wallet first!");
            return;
        }

        try {
            setLoading(true);

            // Your Solana program's public key (replace with your deployed program ID)
            const programId = new PublicKey("YOUR_SOLANA_PROGRAM_ID");

            // Create an account to interact with the program, this may vary based on your program
            const userAccount = new Keypair(); // Or use the user's publicKey for program accounts
            const userAccountPublicKey = publicKey;

            // Example of calling a program's function (instruction)
            const instruction = new Transaction().add(
                // Add a custom instruction to interact with your program
                new TransactionInstruction({
                    keys: [
                        { pubkey: userAccountPublicKey, isSigner: true, isWritable: true },
                        { pubkey: programId, isSigner: false, isWritable: false },
                    ],
                    programId: programId,
                    data: Buffer.from(Uint8Array.of(1)) // Function identifier and data for your program
                })
            );

            // Send the transaction
            const txHash = await sendTransaction(instruction, connection);
            console.log("Transaction sent with hash:", txHash);

            // Optionally confirm the transaction if needed
            const confirmation = await connection.confirmTransaction(txHash, 'processed');
            console.log("Transaction confirmed:", confirmation);

            setLoading(false);
        } catch (error) {
            console.error("Error triggering program:", error);
            setLoading(false);
        }
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
                    programId: new PublicKey(programId),
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
                    <button
                        onClick={signAndSubmit}
                        className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                    >
                        Sign & Submit to Solana
                    </button>

                    <form>
                        <input
                            type="text"
                            name="invoiceData"
                            placeholder="Invoice Data"
                            value={formData.invoiceData}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="hsnNumber"
                            placeholder="HSN Number"
                            value={formData.hsnNumber}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                        <input
                            type="datetime-local"
                            name="timestamp"
                            placeholder="Timestamp"
                            value={formData.timestamp}
                            onChange={(e) =>
                                setFormData({ ...formData, timestamp: new Date(e.target.value).getTime() })
                            }
                        />
                        <input
                            type="text"
                            name="imageProof"
                            placeholder="Image Proof URL"
                            value={formData.imageProof}
                            onChange={handleChange}
                        />
                        <button type="button" onClick={submitData}>
                            Submit
                        </button>
                    </form>
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

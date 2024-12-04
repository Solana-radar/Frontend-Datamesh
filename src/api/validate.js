import { WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from "@project-serum/anchor";
import { PublicKey, Transaction, SystemProgram, Connection } from '@solana/web3.js';

const network = "https://api.devnet.solana.com";

const programId = new PublicKey(import.meta.env.VITE_SOL_PROGRAM_ID_DEVNET);

// Simulated API calls for validation tasks
export const fetchValidationTasks = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return Array.from({ length: 6 }, (_, i) => ({
        id: `task-${i + 1}`,
        merchant: `Merchant ${i + 1}`,
        amount: Math.floor(Math.random() * 1000) + 100,
        date: new Date().toISOString(),
        category: ['Food & Dining', 'Transportation', 'Utilities', 'Office Supplies'][
            Math.floor(Math.random() * 4)
        ],
        imageUrl: 'https://via.placeholder.com/400x600',
    }));
};

export const fetchValidationTasksTest = async () => {
    //let accounts = await connection.getProgramAccounts(program_id);
    //
    //for (const account of accounts) {
    //    let accountData = await pg.program.account.economicDataAccount.fetch(
    //        account.pubkey
    //    );
    //    // Log the raw data of the account
    //    console.log("Account data:", accountData);
    //}
    let connection;
    const wallet = useWallet();
    try {
        if (!wallet || !wallet.connected) {
            alert("Please connect your wallet!");
            return;
        }
        connection = new anchor.web3.Connection(network, "processed");

    } catch (error) {
        console.error("Error submitting economic data:", error);
        alert("Error: " + error.message);
    }


    const accounts = await connection.getProgramAccounts(programId);

    // Process each account and extract data
    const invoiceData = await Promise.all(
        Array.from(accounts, async (account) => {
            const data = await pg.program.account.economicDataAccount.fetch(account.pubkey);

            return {
                pubkey: account.pubkey.toString(), // Public key of the account
                invoiceDataHashId: data.invoice_data_hash_id.toString(), // Unique hash ID
                invoiceData: data.invoice_data, // Invoice data string
                hsnNumber: data.hsn_number, // HSN number
                amount: data.amount.toString(), // Amount in string format
                quantity: data.quantity, // Quantity
                timestamp: new Date(data.timestamp * 1000).toLocaleString(), // Convert to human-readable timestamp
                imageProof: data.image_proof, // Link to decentralized DB for the image
                submitter: data.submitter.toString(), // Submitter's public key
                verificationStatus: data.verification_status, // Verification status
                approvers: [
                    data.approver1.toString(),
                    data.approver2.toString(),
                    data.approver3.toString(),
                ], // List of approvers
                rejectors: [
                    data.rejector1.toString(),
                    data.rejector2.toString(),
                ], // List of rejectors
            };
        })
    );

    // Log all invoices for debugging
    console.log("Fetched Invoices:", invoiceData);

    return invoiceData;
}

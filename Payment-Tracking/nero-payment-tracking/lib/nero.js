import { ethers } from "ethers";
import PaymentTracking from "../artifacts/contracts/PaymentTracking.sol/PaymentTracking.json";

export const CONTRACT_ADDRESS = "0x64D7C43C6aC180F343Bb399Af6BffA8243aeE731"; // Deployed on Nero testnet

let provider;
let signer;
let contract;

export const requireConfig = async () => {
    if (!window.ethereum) throw new Error("MetaMask not found. Please install an EVM compatible wallet.");
    
    let targetProvider = window.ethereum;
    
    if (window.ethereum.providers) {
        const mm = window.ethereum.providers.find(p => p.isMetaMask && !p.isBraveWallet && !p.isCoinbaseWallet && !p.isRabby);
        if (mm) targetProvider = mm;
    } else if (window.ethereum.isMetaMask && (window.ethereum.isBraveWallet || window.ethereum.isCoinbaseWallet || window.ethereum.isRabby)) {
        console.warn("A non-MetaMask wallet is spoofing MetaMask.");
    }

    // Always recreate provider to ensure we use the correct one
    provider = new ethers.BrowserProvider(targetProvider);
};

export const checkConnection = async () => {
    try {
        await requireConfig();
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
            signer = await provider.getSigner();
            contract = new ethers.Contract(CONTRACT_ADDRESS, PaymentTracking.abi, signer);
            return { publicKey: accounts[0] };
        }
        return null;
    } catch {
        return null;
    }
};

export const connectWallet = async () => {
    await requireConfig();
    const accounts = await provider.send("eth_requestAccounts", []);
    if (accounts.length > 0) {
        signer = await provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, PaymentTracking.abi, signer);
        return { publicKey: accounts[0] };
    }
    return null;
};

export const createInvoice = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    if (!payload?.issuer) throw new Error("issuer address is required");
    if (!payload?.recipient) throw new Error("recipient address is required");
    if (!contract) throw new Error("Wallet not connected");

    const tx = await contract.createInvoice(
        payload.id,
        payload.issuer,
        payload.recipient,
        payload.description || "",
        payload.amount,
        payload.dueDate
    );
    return tx.wait();
};

export const markPaid = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    if (!payload?.payer) throw new Error("payer address is required");
    if (!contract) throw new Error("Wallet not connected");

    const tx = await contract.markPaid(
        payload.id,
        payload.payer,
        payload.paidAmount,
        payload.paidAt
    );
    return tx.wait();
};

export const markOverdue = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    if (!payload?.issuer) throw new Error("issuer address is required");
    if (!contract) throw new Error("Wallet not connected");

    const tx = await contract.markOverdue(payload.id, payload.issuer);
    return tx.wait();
};

export const cancelInvoice = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    if (!payload?.issuer) throw new Error("issuer address is required");
    if (!contract) throw new Error("Wallet not connected");

    const tx = await contract.cancelInvoice(payload.id, payload.issuer);
    return tx.wait();
};

export const getInvoice = async (id) => {
    if (!id) throw new Error("id is required");
    if (!contract) {
        await requireConfig();
        contract = new ethers.Contract(CONTRACT_ADDRESS, PaymentTracking.abi, provider);
    }
    const inv = await contract.getInvoice(id);
    return {
        issuer: inv.issuer,
        recipient: inv.recipient,
        description: inv.description,
        amount: inv.amount.toString(),
        paidAmount: inv.paidAmount.toString(),
        status: Number(inv.status),
        dueDate: inv.dueDate.toString(),
        createdAt: inv.createdAt.toString(),
        paidAt: inv.paidAt.toString(),
    };
};

export const listInvoices = async () => {
    if (!contract) {
        await requireConfig();
        contract = new ethers.Contract(CONTRACT_ADDRESS, PaymentTracking.abi, provider);
    }
    const ids = await contract.listInvoices();
    return Array.from(ids);
};

export const getTotalOutstanding = async () => {
    if (!contract) {
        await requireConfig();
        contract = new ethers.Contract(CONTRACT_ADDRESS, PaymentTracking.abi, provider);
    }
    const total = await contract.getTotalOutstanding();
    return total.toString();
};

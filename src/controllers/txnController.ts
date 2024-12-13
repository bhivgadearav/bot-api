import { Request, Response } from "express";
import bs58 from "bs58";
import { Connection, Keypair, clusterApiUrl, Cluster, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const switchNetwork = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(400).json({ error: 'User not authenticated' });
            return; 
        }
        const { network, rpcUrl } = req.body;
        const validNetworks = ['mainnet-beta', 'testnet', 'devnet', 'custom'];
        if (!validNetworks.includes(network)) {
            res.status(400).json({ error: 'Invalid network type' });
            return; 
        }
        else if (validNetworks.includes(network)) {
            if (network === 'custom' && !rpcUrl) {
                res.status(400).json({ error: 'RPC URL required for custom network' });  
                return; 
            }
            else if (network === 'custom') {
                req.user.currentNetwork = rpcUrl;
            }
            else {
                req.user.currentNetwork = clusterApiUrl(network);
            }
        }
        await req.user.save();
        res.status(200).json({ message: 'Network switched successfully' });
        return; 
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to switch network', details: error.message });
        return; 
    }
};

export const getBalance = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(400).json({ error: 'User not authenticated' });
            return;
        }
        const { walletIndex } = req.body;
        const connection = new Connection(req.user.currentNetwork, 'confirmed');
        const balance = await connection.getBalance(new PublicKey(req.user.wallets[walletIndex].PublicKey));
        res.status(200).json({ balance });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch balance', details: error.message });
    }
};

export const transfer = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(400).json({ error: 'User not authenticated' });
            return;
        }
        const { to, amount, walletIndex } = req.body;
        const connection = new Connection(req.user.currentNetwork, 'confirmed');
        const privateKeyArray = bs58.decode(req.user.wallets[walletIndex].PrivateKey);
        const keypair = Keypair.fromSecretKey(privateKeyArray);
        const accountInfo = await connection.getAccountInfo(keypair.publicKey);
        if (!accountInfo) {
            res.status(400).json({ error: 'Account not found' });
            return;
        }
        if (accountInfo?.lamports < amount * LAMPORTS_PER_SOL) {
            res.status(400).json({ error: 'Insufficient balance' });
            return;
        }
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey: new PublicKey(to),
                lamports: amount,
            })
        );
        await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: false, preflightCommitment: 'confirmed' });
        res.status(200).json({ transaction });
    } catch (error: any) {
        res.status(500).json({ error: 'Transfer failed', details: error.message });
    }
};

export const requestAirdrop = async (req: Request, res: Response): Promise<void> => {}

export const signAndSendTxn = async (req: Request, res: Response): Promise<void> => {}



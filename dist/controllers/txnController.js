"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAndSendTxn = exports.requestAirdrop = exports.transfer = exports.getBalance = exports.switchNetwork = void 0;
const bs58_1 = __importDefault(require("bs58"));
const web3_js_1 = require("@solana/web3.js");
const switchNetwork = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                req.user.currentNetwork = (0, web3_js_1.clusterApiUrl)(network);
            }
        }
        yield req.user.save();
        res.status(200).json({ message: 'Network switched successfully' });
        return;
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to switch network', details: error.message });
        return;
    }
});
exports.switchNetwork = switchNetwork;
const getBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user) {
            res.status(400).json({ error: 'User not authenticated' });
            return;
        }
        const { walletName } = req.body;
        const connection = new web3_js_1.Connection(req.user.currentNetwork, 'confirmed');
        const publicKey = new web3_js_1.PublicKey(((_a = req.user.wallets.find(w => w.Name === walletName)) === null || _a === void 0 ? void 0 : _a.PublicKey) || req.user.wallets[0].PublicKey);
        const balance = yield connection.getBalance(publicKey);
        res.status(200).json({ balance });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch balance', details: error.message });
    }
});
exports.getBalance = getBalance;
const transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user) {
            res.status(400).json({ error: 'User not authenticated' });
            return;
        }
        const { to, amount, walletName } = req.body;
        const connection = new web3_js_1.Connection(req.user.currentNetwork, 'confirmed');
        const privateKeyArray = bs58_1.default.decode(((_a = req.user.wallets.find(w => w.Name === walletName)) === null || _a === void 0 ? void 0 : _a.PrivateKey) || req.user.wallets[0].PrivateKey);
        const keypair = web3_js_1.Keypair.fromSecretKey(privateKeyArray);
        const accountInfo = yield connection.getAccountInfo(keypair.publicKey);
        if (!accountInfo) {
            res.status(400).json({ error: 'Account not found' });
            return;
        }
        if ((accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.lamports) < amount * web3_js_1.LAMPORTS_PER_SOL) {
            res.status(400).json({ error: 'Insufficient balance' });
            return;
        }
        const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: new web3_js_1.PublicKey(to),
            lamports: amount * web3_js_1.LAMPORTS_PER_SOL,
        }));
        transaction.recentBlockhash = (yield connection.getLatestBlockhash('max')).blockhash;
        transaction.feePayer = keypair.publicKey;
        transaction.sign(keypair);
        const signature = yield connection.sendRawTransaction(transaction.serialize(), { skipPreflight: false, preflightCommitment: 'confirmed' });
        res.status(200).json({ signature });
    }
    catch (error) {
        res.status(500).json({ error: 'Transfer failed', details: error.message });
    }
});
exports.transfer = transfer;
const requestAirdrop = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.requestAirdrop = requestAirdrop;
const signAndSendTxn = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.signAndSendTxn = signAndSendTxn;

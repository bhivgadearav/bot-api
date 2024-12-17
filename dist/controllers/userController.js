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
exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bip39_1 = require("bip39");
const ed25519_hd_key_1 = require("ed25519-hd-key");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const SECRET = process.env.JWT_SECRET || 'defaultsecret';
const generateSeed = () => {
    const HDMnemonic = (0, bip39_1.generateMnemonic)();
    const HDSeed = (0, bip39_1.mnemonicToSeed)(HDMnemonic);
    return { HDMnemonic, HDSeed };
};
const generateWallet = (index) => __awaiter(void 0, void 0, void 0, function* () {
    const { HDSeed: seed, HDMnemonic } = generateSeed();
    const mnemonic = HDMnemonic.split(" ");
    const solanaSeed = yield seed.then(bytes => bytes.toString('hex'));
    const path = `m/44'/501'/${index == 0 ? 0 : index - 1}'/0'`;
    const derivedSeed = (0, ed25519_hd_key_1.derivePath)(path, solanaSeed).key;
    const secret = tweetnacl_1.default.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = web3_js_1.Keypair.fromSecretKey(secret);
    const publicKey = keypair.publicKey.toBase58();
    const privateKey = bs58_1.default.encode(keypair.secretKey);
    return {
        mnemonic,
        publicKey,
        privateKey
    };
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telegramId, password, name } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const { mnemonic, publicKey, privateKey } = yield generateWallet(0);
        const newUser = new userModel_1.default({
            telegramId,
            password: hashedPassword,
            mnemonic: mnemonic,
            wallets: [{ Name: name, PublicKey: publicKey, PrivateKey: privateKey }],
            mainWallet: { Name: name, PublicKey: publicKey, PrivateKey: privateKey }
        });
        yield newUser.save();
        res.status(201).json({
            message: 'User created',
            mnemonic: mnemonic,
            publicKey: publicKey,
            privateKey: privateKey
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Signup failed', details: error.message });
    }
});
exports.signup = signup;

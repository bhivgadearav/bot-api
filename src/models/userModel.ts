import mongoose, { Schema, Document } from "mongoose";
import { clusterApiUrl } from "@solana/web3.js";

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

// Interfaces for type safety
export type HDMnemonic = string[];

export interface Wallet {
  PublicKey: string;
  PrivateKey: string;
}

export interface Txn {
  id: string;
  signature: string;
  status: TransactionStatus;
}

export interface UserInterface extends Document {
  telegramId: string;
  password: string;
  mnemonic: HDMnemonic;
  wallets: Wallet[];
  txns?: Txn[];
  currentNetwork: string;
}

// Schemas
const WalletSchema = new Schema<Wallet>({
  PublicKey: { type: String, required: true },
  PrivateKey: { type: String, required: true },
});

const TxnSchema = new Schema<Txn>({
  id: { type: String, required: true },
  signature: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(TransactionStatus),
    required: true,
  },
});

const UserSchema = new Schema({
  telegramId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mnemonic: { type: [String], required: true },
  wallets: { type: [WalletSchema], required: true },
  txns: { type: [TxnSchema], default: [] },
  currentNetwork: { type: String, default: clusterApiUrl("mainnet-beta") },
});

// Export the User model
export default mongoose.model("User", UserSchema);

import mongoose from "mongoose";
import { Wallet, WalletTransaction } from "../entities/Wallet";

export interface IWalletRepository {
    createWallet(WalletDetails: Wallet): Promise<Wallet>;
    findByUserId(userId: string, session?: mongoose.ClientSession): Promise<Wallet | null>;
    addTransaction(userId: string, amount: number, transaction: WalletTransaction, session?: mongoose.ClientSession): Promise<void>;
    getPaginatedTransactions(userId: string, page: number, limit: number): Promise<{ transactions: WalletTransaction[], total: number, balance: number }>;
}
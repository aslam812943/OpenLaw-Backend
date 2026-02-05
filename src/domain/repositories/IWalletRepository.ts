import { Wallet, WalletTransaction } from "../entities/Wallet";

export interface IWalletRepository {
    createWallet(WalletDetails: Wallet): Promise<Wallet>;
    findByUserId(userId: string): Promise<Wallet | null>;
    addTransaction(userId: string, amount: number, transaction: WalletTransaction): Promise<void>;
    getPaginatedTransactions(userId: string, page: number, limit: number): Promise<{ transactions: WalletTransaction[], total: number, balance: number }>;
}
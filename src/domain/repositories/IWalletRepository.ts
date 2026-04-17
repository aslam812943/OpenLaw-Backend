import { ISession } from "../interfaces/ISession";
import { Wallet, WalletTransaction } from "../entities/Wallet";

export interface IWalletRepository {
    createWallet(WalletDetails: Wallet): Promise<Wallet>;
    findByUserId(userId: string, session?: ISession): Promise<Wallet | null>;
    addTransaction(userId: string, amount: number, transaction: WalletTransaction, session?: ISession): Promise<void>;
    getPaginatedTransactions(userId: string, page: number, limit: number): Promise<{ transactions: WalletTransaction[], total: number, balance: number }>;
}
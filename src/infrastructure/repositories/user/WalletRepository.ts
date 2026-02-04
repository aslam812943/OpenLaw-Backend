import { Wallet, WalletTransaction } from "../../../domain/entities/Wallet";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { WalletModel, IWalletDocument } from "../../db/models/Wallet";
import { BaseRepository } from "../user/BaseRepository";
import { InternalServerError } from "../../errors/InternalServerError";
import mongoose from "mongoose";

export class WalletRepository extends BaseRepository<IWalletDocument> implements IWalletRepository {
    constructor() {
        super(WalletModel);
    }

    async createWallet(wallet: Wallet): Promise<Wallet> {
        try {
            const walletDoc = new WalletModel({
                userId: wallet.userId,
                balance: wallet.balance,
                transactions: wallet.transactions
            });
            await walletDoc.save();
            return this.mapToDomain(walletDoc);
        } catch (error: unknown) {
            throw new InternalServerError("Database error while creating wallet.");
        }
    }

    async findByUserId(userId: string): Promise<Wallet | null> {
        try {
            const walletDoc = await WalletModel.findOne({ userId });
            if (!walletDoc) return null;
            return this.mapToDomain(walletDoc);
        } catch (error: unknown) {
            throw new InternalServerError("Database error while fetching wallet by user ID.");
        }
    }

    async addTransaction(userId: string, amount: number, transaction: WalletTransaction): Promise<void> {
        try {
            const session = await mongoose.startSession();
            await session.withTransaction(async () => {
                const wallet = await WalletModel.findOne({ userId }).session(session);
                if (!wallet) {
                    const newWallet = new WalletModel({
                        userId,
                        balance: amount,
                        transactions: [transaction]
                    });
                    await newWallet.save({ session });
                } else {
                    wallet.balance += amount;
                    wallet.transactions.push(transaction as any);
                    await wallet.save({ session });
                }
            });
            await session.endSession();
        } catch (error: unknown) {
            throw new InternalServerError("Database error while updating wallet.");
        }
    }

    private mapToDomain(doc: IWalletDocument): Wallet {
        return new Wallet(
            String(doc.userId),
            doc.balance,
            doc.transactions.map(t => ({
                type: t.type,
                amount: t.amount,
                date: t.date,
                status: t.status,
                bookingId: String(t.bookingId),
                description: t.description,
                metadata: t.metadata
            })),
            String(doc._id)
        );
    }
}

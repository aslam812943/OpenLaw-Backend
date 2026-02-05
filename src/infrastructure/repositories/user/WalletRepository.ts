import { Wallet, WalletTransaction } from "../../../domain/entities/Wallet";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { WalletModel, IWalletDocument, ITransactions } from "../../db/models/Wallet";
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
                    wallet.transactions.push(transaction as unknown as ITransactions);
                    await wallet.save({ session });
                }
            });
            await session.endSession();
        } catch (error: unknown) {
            throw new InternalServerError("Database error while updating wallet.");
        }
    }

    async getPaginatedTransactions(userId: string, page: number, limit: number): Promise<{ transactions: WalletTransaction[], total: number, balance: number }> {
        try {
            const skip = (page - 1) * limit;

            const result = await WalletModel.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                {
                    $project: {
                        balance: 1,
                        totalTransactions: { $size: "$transactions" },
                        transactions: {
                            $slice: [
                                { $reverseArray: "$transactions" },
                                skip,
                                limit
                            ]
                        }
                    }
                }
            ]);

            if (!result || result.length === 0) {
                return { transactions: [], total: 0, balance: 0 };
            }

            const { transactions, totalTransactions, balance } = result[0] as {
                transactions: any[];
                totalTransactions: number;
                balance: number;
            };

            return {
                transactions: transactions.map((t) => ({
                    type: t.type,
                    amount: t.amount,
                    date: t.date,
                    status: t.status,
                    bookingId: String(t.bookingId),
                    description: t.description,
                    metadata: t.metadata
                })),
                total: totalTransactions,
                balance: balance
            };
        } catch (error: unknown) {
            throw new InternalServerError("Database error while fetching paginated transactions.");
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

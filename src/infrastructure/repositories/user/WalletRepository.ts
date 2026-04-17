import { Wallet, WalletTransaction } from "../../../domain/entities/Wallet";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { WalletModel, IWalletDocument, ITransactions } from "../../db/models/Wallet";
import { BaseRepository } from "../BaseRepository";
import { InternalServerError } from "../../errors/InternalServerError";
import { MessageConstants } from "../../constants/MessageConstants";
import mongoose from "mongoose";
import { ISession } from "../../../domain/interfaces/ISession";
import { MongooseSession } from "../../db/MongooseDatabaseSession";

export class WalletRepository extends BaseRepository<IWalletDocument> implements IWalletRepository {
    constructor() {
        super(WalletModel);
    }

    async createWallet(wallet: Wallet): Promise<Wallet> {
        try {
            const walletDoc = await this.baseCreate({
                userId: new mongoose.Types.ObjectId(wallet.userId) as unknown as mongoose.Types.ObjectId,
                balance: wallet.balance,
                transactions: wallet.transactions as unknown as ITransactions[]
            });
            return this.mapToDomain(walletDoc);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
        }
    }

    async findByUserId(userId: string, session?: ISession): Promise<Wallet | null> {
        try {
            const walletDoc = await this.baseFindOne({ userId }, {}, session);
            if (!walletDoc) return null;
            return this.mapToDomain(walletDoc);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async addTransaction(userId: string, amount: number, transaction: WalletTransaction, externalSession?: ISession): Promise<void> {
        try {
            const nativeExternalSession = (externalSession as MongooseSession)?.nativeSession;
            if (nativeExternalSession) {
                await this._executeAddTransaction(userId, amount, transaction, nativeExternalSession);
            } else {
                const session = await mongoose.startSession();
                await session.withTransaction(async () => {
                    await this._executeAddTransaction(userId, amount, transaction, session);
                });
                await session.endSession();
            }
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    private async _executeAddTransaction(userId: string, amount: number, transaction: WalletTransaction, session: mongoose.ClientSession): Promise<void> {
        const wallet = await this.model.findOne({ userId }).session(session);
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
    }

    async getPaginatedTransactions(userId: string, page: number, limit: number): Promise<{ transactions: WalletTransaction[], total: number, balance: number }> {
        try {
            const skip = (page - 1) * limit;

            const result = await this.model.aggregate([
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
                transactions: ITransactions[];
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
            throw new InternalServerError(MessageConstants.REPOSITORY.TRANSACTION_FETCH_ERROR);
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

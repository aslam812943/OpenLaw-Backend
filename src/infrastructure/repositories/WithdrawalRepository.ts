import { IWithdrawalRepository } from "../../domain/repositories/IWithdrawalRepository";
import { Withdrawal } from "../../domain/entities/Withdrawal";
import { WithdrawalModel, IWithdrawalDocument } from "../db/models/admin/WithdrawalModel";
import { InternalServerError } from "../errors/InternalServerError";
import { MessageConstants } from "../constants/MessageConstants";
import mongoose from "mongoose";

import { BaseRepository } from "./BaseRepository";

export class WithdrawalRepository extends BaseRepository<IWithdrawalDocument> implements IWithdrawalRepository {
    constructor() {
        super(WithdrawalModel);
    }
    async create(withdrawal: Withdrawal): Promise<Withdrawal> {
        try {
            const doc = await WithdrawalModel.create({
                lawyerId: new mongoose.Types.ObjectId(withdrawal.lawyerId),
                amount: withdrawal.amount,
                status: withdrawal.status,
                requestDate: withdrawal.requestDate
            });
            return this.mapToDomain(doc);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.WITHDRAWAL_CREATE_ERROR);
        }
    }

    async findById(id: string): Promise<Withdrawal | null> {
        try {
            const doc = await WithdrawalModel.findById(id);
            return doc ? this.mapToDomain(doc) : null;
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_BY_ID_ERROR);
        }
    }

    async updateStatus(id: string, status: 'approved' | 'rejected', details?: { commissionAmount: number, finalAmount: number, processedDate: Date }): Promise<void> {
        try {
            const updateData: Partial<IWithdrawalDocument> = { status };
            if (details) {
                updateData.commissionAmount = details.commissionAmount;
                updateData.finalAmount = details.finalAmount;
                updateData.processedDate = details.processedDate;
            }
            await WithdrawalModel.findByIdAndUpdate(id, updateData);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    async findByLawyerId(lawyerId: string): Promise<Withdrawal[]> {
        try {
            const docs = await WithdrawalModel.find({ lawyerId: new mongoose.Types.ObjectId(lawyerId) }).sort({ createdAt: -1 });
            return docs.map(doc => this.mapToDomain(doc));
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async findAllPending(): Promise<Withdrawal[]> {
        try {
            const docs = await WithdrawalModel.find({ status: 'pending' })
                .populate('lawyerId', 'name isBlock email')
                .sort({ createdAt: 1 });

            return docs.map(doc => {
                const withdrawal = this.mapToDomain(doc);
                if (doc.lawyerId && typeof doc.lawyerId === 'object') {
                    const lawyer = doc.lawyerId as unknown as { name: string; isBlock: boolean; email: string };
                    withdrawal.lawyerName = lawyer.name;
                    (withdrawal as { isBlock?: boolean }).isBlock = lawyer.isBlock;
                    (withdrawal as { email?: string }).email = lawyer.email;
                }
                return withdrawal;
            });
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    private mapToDomain(doc: IWithdrawalDocument): Withdrawal {
        return new Withdrawal(
            doc.lawyerId.toString(),
            doc.amount,
            doc.status,
            doc.requestDate,
            doc.processedDate,
            doc.commissionAmount,
            doc.finalAmount,
            doc._id.toString()
        );
    }
}

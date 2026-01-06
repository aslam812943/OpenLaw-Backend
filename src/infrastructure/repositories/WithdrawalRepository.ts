import { IWithdrawalRepository } from "../../domain/repositories/IWithdrawalRepository";
import { Withdrawal } from "../../domain/entities/Withdrawal";
import { WithdrawalModel, IWithdrawalDocument } from "../db/models/admin/WithdrawalModel";
import { InternalServerError } from "../errors/InternalServerError";
import mongoose from "mongoose";

export class WithdrawalRepository implements IWithdrawalRepository {
    async create(withdrawal: Withdrawal): Promise<Withdrawal> {
        try {
            const doc = await WithdrawalModel.create({
                lawyerId: new mongoose.Types.ObjectId(withdrawal.lawyerId),
                amount: withdrawal.amount,
                status: withdrawal.status,
                requestDate: withdrawal.requestDate
            });
            return this.mapToDomain(doc);
        } catch (error: any) {
            throw new InternalServerError("Database error while creating withdrawal request.");
        }
    }

    async findById(id: string): Promise<Withdrawal | null> {
        try {
            const doc = await WithdrawalModel.findById(id);
            return doc ? this.mapToDomain(doc) : null;
        } catch (error: any) {
            throw new InternalServerError("Database error while fetching withdrawal by ID.");
        }
    }

    async updateStatus(id: string, status: 'approved' | 'rejected', details?: { commissionAmount: number, finalAmount: number, processedDate: Date }): Promise<void> {
        try {
            const updateData: any = { status };
            if (details) {
                updateData.commissionAmount = details.commissionAmount;
                updateData.finalAmount = details.finalAmount;
                updateData.processedDate = details.processedDate;
            }
            await WithdrawalModel.findByIdAndUpdate(id, updateData);
        } catch (error: any) {
            throw new InternalServerError("Database error while updating withdrawal status.");
        }
    }

    async findByLawyerId(lawyerId: string): Promise<Withdrawal[]> {
        try {
            const docs = await WithdrawalModel.find({ lawyerId: new mongoose.Types.ObjectId(lawyerId) }).sort({ createdAt: -1 });
            return docs.map(doc => this.mapToDomain(doc));
        } catch (error: any) {
            throw new InternalServerError("Database error while fetching lawyer withdrawals.");
        }
    }

    async findAllPending(): Promise<Withdrawal[]> {
        try {
            const docs = await WithdrawalModel.find({ status: 'pending' })
                .populate('lawyerId', 'name')
                .sort({ createdAt: 1 });

            return docs.map(doc => {
                const withdrawal = this.mapToDomain(doc);
                if (doc.lawyerId && (doc.lawyerId as any).name) {
                    withdrawal.lawyerName = (doc.lawyerId as any).name;
                }
                return withdrawal;
            });
        } catch (error: any) {
            throw new InternalServerError("Database error while fetching pending withdrawals.");
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

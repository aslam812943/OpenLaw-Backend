import { Withdrawal } from "../entities/Withdrawal";

export interface IWithdrawalRepository {
    create(withdrawal: Withdrawal): Promise<Withdrawal>;
    findById(id: string): Promise<Withdrawal | null>;
    updateStatus(id: string, status: 'approved' | 'rejected', details?: { commissionAmount: number, finalAmount: number, processedDate: Date }): Promise<void>;
    findByLawyerId(lawyerId: string, page?: number, limit?: number): Promise<{ withdrawals: Withdrawal[], total: number }>;
    findAllPending(): Promise<Withdrawal[]>;
}

import { IWithdrawalRepository } from "../../../domain/repositories/IWithdrawalRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class ApprovePayoutUseCase {
    constructor(
        private _withdrawalRepository: IWithdrawalRepository,
        private _lawyerRepository: ILawyerRepository,
        private _subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(withdrawalId: string): Promise<void> {
        const withdrawal = await this._withdrawalRepository.findById(withdrawalId);
        if (!withdrawal) {
            throw new NotFoundError("Withdrawal request not found.");
        }

        if (withdrawal.status !== 'pending') {
            throw new BadRequestError("Withdrawal request is already processed.");
        }

        const lawyer = await this._lawyerRepository.findById(withdrawal.lawyerId);
        if (!lawyer) {
            throw new NotFoundError("Lawyer not found.");
        }

       
        if ((lawyer.walletBalance || 0) < withdrawal.amount) {
            throw new BadRequestError("Lawyer has insufficient balance for this payout.");
        }

     
        await this._lawyerRepository.updateWalletBalance(withdrawal.lawyerId, -withdrawal.amount);

        
        await this._withdrawalRepository.updateStatus(withdrawalId, 'approved', {
            commissionAmount: 0,
            finalAmount: withdrawal.amount,
            processedDate: new Date()
        });
    }
}

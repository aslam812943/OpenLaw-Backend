import { IWithdrawalRepository } from "../../../domain/repositories/IWithdrawalRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { IApprovePayoutUseCase } from "../../interface/use-cases/admin/IApprovePayoutUseCase";
import { ISendNotificationUseCase } from "../../interface/use-cases/common/notification/ISendNotificationUseCase";

export class ApprovePayoutUseCase implements IApprovePayoutUseCase {
    constructor(
        private _withdrawalRepository: IWithdrawalRepository,
        private _lawyerRepository: ILawyerRepository,
   private _sendNotificationUseCase: ISendNotificationUseCase
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


        // if ((lawyer.walletBalance || 0) < withdrawal.amount) {

        //     // throw new BadRequestError("Lawyer has insufficient balance for this payout.");
        // }


        await this._withdrawalRepository.updateStatus(withdrawalId, 'approved', {
            commissionAmount: 0,
            finalAmount: withdrawal.amount,
            processedDate: new Date()
        });

        // Notify Lawyer
        await this._sendNotificationUseCase.execute(
            withdrawal.lawyerId,
            `Your payout request for ₹${withdrawal.amount} has been approved by the admin.`,
            'PAYOUT_APPROVED',
            { withdrawalId }
        );
    }
}

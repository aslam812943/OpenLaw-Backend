import { IWithdrawalRepository } from "../../../domain/repositories/IWithdrawalRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { IRejectPayoutUseCase } from "../../interface/use-cases/admin/IRejectPayoutUseCase";

export class RejectPayoutUseCase implements IRejectPayoutUseCase {
    constructor(
        private _withdrawalRepository: IWithdrawalRepository,
        private _lawyerRepository: ILawyerRepository
    ) { }

    async execute(withdrawalId: string): Promise<void> {
        const withdrawal = await this._withdrawalRepository.findById(withdrawalId);
        if (!withdrawal) {
            throw new NotFoundError("Withdrawal request not found.");
        }

        if (withdrawal.status !== 'pending') {
            throw new BadRequestError("Withdrawal request is already processed.");
        }

        await this._lawyerRepository.updateWalletBalance(withdrawal.lawyerId, withdrawal.amount);

        await this._withdrawalRepository.updateStatus(withdrawalId, 'rejected', {
            commissionAmount: 0,
            finalAmount: 0,
            processedDate: new Date()
        });
    }
}

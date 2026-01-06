import { IWithdrawalRepository } from "../../../domain/repositories/IWithdrawalRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { Withdrawal } from "../../../domain/entities/Withdrawal";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class RequestPayoutUseCase {
    constructor(
        private _withdrawalRepository: IWithdrawalRepository,
        private _lawyerRepository: ILawyerRepository
    ) { }

    async execute(lawyerId: string, amount: number): Promise<Withdrawal> {
        if (amount <= 0) {
            throw new BadRequestError("Payout amount must be greater than zero.");
        }

        const lawyer = await this._lawyerRepository.findById(lawyerId);
        if (!lawyer) {
            throw new NotFoundError("Lawyer not found.");
        }

        if ((lawyer.walletBalance || 0) < amount) {
            throw new BadRequestError("Insufficient wallet balance.");
        }

        const withdrawal = new Withdrawal(
            lawyerId,
            amount,
            'pending',
            new Date()
        );

        return await this._withdrawalRepository.create(withdrawal);
    }
}

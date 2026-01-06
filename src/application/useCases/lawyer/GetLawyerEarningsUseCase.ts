import { IGetLawyerEarningsUseCase } from "../../interface/use-cases/lawyer/IGetLawyerEarningsUseCase";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { GetLawyerEarningsDTO } from "../../dtos/lawyer/GetLawyerEarningsDTO";
import { LawyerEarningsMapper } from "../../mapper/lawyer/LawyerEarningsMapper";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class GetLawyerEarningsUseCase implements IGetLawyerEarningsUseCase {
    constructor(
        private bookingRepository: IBookingRepository,
        private lawyerRepository: ILawyerRepository,
        private subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(lawyerId: string): Promise<GetLawyerEarningsDTO> {
        const [bookings, lawyer] = await Promise.all([
            this.bookingRepository.findByLawyerId(lawyerId),
            this.lawyerRepository.findById(lawyerId)
        ]);

        if (!lawyer) {
            throw new NotFoundError("Lawyer not found.");
        }

        let commissionPercent = 10; 
        if ((lawyer as any).subscriptionId) {
            const subscription = await this.subscriptionRepository.findById((lawyer as any).subscriptionId.toString());
            if (subscription) {
                commissionPercent = subscription.commissionPercent;
            }
        }

        return LawyerEarningsMapper.toDTO(bookings, lawyer.walletBalance || 0, commissionPercent);
    }
}

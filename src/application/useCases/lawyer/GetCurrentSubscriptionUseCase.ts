import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { SubscriptionDTO } from "../../dtos/lawyer/SubscriptionDTO";
import { SubscriptionMapper } from "../../mapper/lawyer/SubscriptionMapper";
import { IGetCurrentSubscriptionUseCase } from "../../interface/use-cases/lawyer/IGetCurrentSubscriptionUseCase";




export class GetCurrentSubscriptionUseCase implements IGetCurrentSubscriptionUseCase {
    constructor(
        private lawyerRepository: ILawyerRepository,
        private subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(lawyerId: string): Promise<SubscriptionDTO | null> {
        const lawyer = await this.lawyerRepository.findById(lawyerId);
        if (!lawyer || !lawyer.subscriptionId) {
            return null;
        }

        const subscription = await this.subscriptionRepository.findById(lawyer.subscriptionId);
        if (!subscription) {
            return null;
        }

        return SubscriptionMapper.toDTO(subscription);
    }
}

import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { SubscriptionDTO } from "../../dtos/lawyer/SubscriptionDTO";
import { SubscriptionMapper } from "../../mapper/lawyer/SubscriptionMapper";
import { IGetCurrentSubscriptionUseCase } from "../../interface/use-cases/lawyer/IGetCurrentSubscriptionUseCase";




export class GetCurrentSubscriptionUseCase implements IGetCurrentSubscriptionUseCase {
    constructor(
        private _lawyerRepository: ILawyerRepository,
        private _subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(lawyerId: string): Promise<SubscriptionDTO | null> {
        const lawyer = await this._lawyerRepository.findById(lawyerId);
        if (!lawyer || !lawyer.subscriptionId) {
            return null;
        }

        const subscription = await this._subscriptionRepository.findById(lawyer.subscriptionId);
        if (!subscription) {
            return null;
        }

        return SubscriptionMapper.toDTO(subscription, lawyer.subscriptionExpiryDate);
    }
}

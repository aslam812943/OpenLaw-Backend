import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { SubscriptionDTO } from "../../dtos/lawyer/SubscriptionDTO";
import { SubscriptionMapper } from "../../mapper/lawyer/SubscriptionMapper";

export class GetSubscriptionPlansUseCase {
    constructor(private subscriptionRepository: ISubscriptionRepository) { }

    async execute(): Promise<SubscriptionDTO[]> {
        const subscriptions = await this.subscriptionRepository.findAll();
        return SubscriptionMapper.toDTOs(subscriptions);
    }
}


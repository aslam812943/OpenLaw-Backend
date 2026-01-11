import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { SubscriptionDTO } from "../../dtos/lawyer/SubscriptionDTO";
import { SubscriptionMapper } from "../../mapper/lawyer/SubscriptionMapper";
import { IGetSubscriptionPlansUseCase } from "../../interface/use-cases/lawyer/IGetSubscriptionPlansUseCase";



export class GetSubscriptionPlansUseCase implements IGetSubscriptionPlansUseCase {
    constructor(private subscriptionRepository: ISubscriptionRepository) { }

    async execute(): Promise<SubscriptionDTO[]> {
        const subscriptions = await this.subscriptionRepository.findActive();
        return SubscriptionMapper.toDTOs(subscriptions);
    }
}


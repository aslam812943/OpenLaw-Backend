import { IGetSubscriptionsUseCase } from "../../interface/use-cases/admin/IGetSubscriptionsUseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { SubscriptionDTO } from "../../dtos/lawyer/SubscriptionDTO";
import { SubscriptionMapper } from "../../mapper/lawyer/SubscriptionMapper";

export class GetSubscriptionsUseCase implements IGetSubscriptionsUseCase {
    constructor(private _subscriptionRepository: ISubscriptionRepository) { }

    async execute(page: number = 1, limit: number = 10): Promise<{ plans: SubscriptionDTO[], total: number }> {
        const { plans, total } = await this._subscriptionRepository.findAllSubscription(page, limit);
        return {
            plans: SubscriptionMapper.toDTOs(plans),
            total
        };
    }
}

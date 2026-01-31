import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { SubscriptionDTO } from "../../dtos/lawyer/SubscriptionDTO";
import { SubscriptionMapper } from "../../mapper/lawyer/SubscriptionMapper";
import { IGetSubscriptionPlansUseCase } from "../../interface/use-cases/lawyer/IGetSubscriptionPlansUseCase";



export class GetSubscriptionPlansUseCase implements IGetSubscriptionPlansUseCase {
    constructor(private _subscriptionRepository: ISubscriptionRepository) { }

    async execute(page: number, limit: number): Promise<{ plans: SubscriptionDTO[], total: number }> {
        const { plans, total } = await this._subscriptionRepository.findActive(page, limit);
        return {
            plans: SubscriptionMapper.toDTOs(plans),
            total
        };
    }
}


import { IGetSubscriptionsUseCase } from "../../interface/use-cases/admin/IGetSubscriptionsUseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { SubscriptionDTO } from "../../dtos/lawyer/SubscriptionDTO";
import { SubscriptionMapper } from "../../mapper/lawyer/SubscriptionMapper";

export class GetSubscriptionsUseCase implements IGetSubscriptionsUseCase {
    constructor(private _subscriptionRepository: ISubscriptionRepository) { }

    async execute(): Promise<SubscriptionDTO[]> {
        const subscriptions = await this._subscriptionRepository.findAll();
        return SubscriptionMapper.toDTOs(subscriptions);
    }
}

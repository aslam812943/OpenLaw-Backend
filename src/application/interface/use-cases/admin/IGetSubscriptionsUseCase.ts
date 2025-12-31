import { SubscriptionDTO } from "../../../dtos/lawyer/SubscriptionDTO";

export interface IGetSubscriptionsUseCase {
    execute(): Promise<SubscriptionDTO[]>;
}

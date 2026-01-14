import { SubscriptionDTO } from "../../../dtos/lawyer/SubscriptionDTO";

export interface IGetSubscriptionsUseCase {
    execute(page?: number, limit?: number): Promise<{ plans: SubscriptionDTO[], total: number }>;
}

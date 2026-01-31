import { SubscriptionDTO } from "../../../dtos/lawyer/SubscriptionDTO"


export interface IGetSubscriptionPlansUseCase {
    execute(page: number, limit: number): Promise<{ plans: SubscriptionDTO[], total: number }>
}
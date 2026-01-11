import { SubscriptionDTO } from "../../../dtos/lawyer/SubscriptionDTO"


export interface IGetSubscriptionPlansUseCase {
    execute():Promise<SubscriptionDTO[]>
}
import { CreateSubscriptionDTO } from "../../../application/dtos/admin/CreateSubscriptionDTO"
import { Subscription } from "../../entities/Subscription"
export interface ISubscriptionRepository {
    create(data:Subscription): Promise<void>
    findAll(): Promise<any[]>
}
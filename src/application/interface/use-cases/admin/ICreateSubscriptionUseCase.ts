import { Subscription } from "../../../../domain/entities/Subscription";
import { CreateSubscriptionDTO } from "../../../dtos/admin/CreateSubscriptionDTO";
export interface ICreateSubscriptionUseCase {
    execute(data: CreateSubscriptionDTO): Promise<void>; 
}

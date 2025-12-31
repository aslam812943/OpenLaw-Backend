import { CreateSubscriptionCheckoutDTO } from "../../../dtos/lawyer/CreateSubscriptionCheckoutDTO";

export interface ICreateSubscriptionCheckoutUseCase {
    execute(data: CreateSubscriptionCheckoutDTO): Promise<string>;
}

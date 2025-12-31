import { StripeService } from "../../../infrastructure/services/StripeService";
import { ICreateSubscriptionCheckoutUseCase } from "../../interface/use-cases/lawyer/ICreateSubscriptionCheckoutUseCase";
import { CreateSubscriptionCheckoutDTO } from "../../dtos/lawyer/CreateSubscriptionCheckoutDTO";

export class CreateSubscriptionCheckoutUseCase implements ICreateSubscriptionCheckoutUseCase {
    constructor(private stripeService: StripeService) { }

    async execute(dto: CreateSubscriptionCheckoutDTO): Promise<string> {
        return await this.stripeService.createSubscriptionCheckoutSession(
            dto.lawyerId,
            dto.email,
            dto.planName,
            dto.price,
            dto.subscriptionId
        );
    }
}

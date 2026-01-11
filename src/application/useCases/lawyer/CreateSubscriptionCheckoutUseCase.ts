import { StripeService } from "../../../infrastructure/services/StripeService";
import { ICreateSubscriptionCheckoutUseCase } from "../../interface/use-cases/lawyer/ICreateSubscriptionCheckoutUseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { CreateSubscriptionCheckoutDTO } from "../../dtos/lawyer/CreateSubscriptionCheckoutDTO";

export class CreateSubscriptionCheckoutUseCase implements ICreateSubscriptionCheckoutUseCase {
    constructor(
        private stripeService: StripeService,
        private lawyerRepository: ILawyerRepository,
        private subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(dto: CreateSubscriptionCheckoutDTO): Promise<string> {
        const lawyer = await this.lawyerRepository.findById(dto.lawyerId);
        if (!lawyer) throw new Error("Lawyer not found");

        if (lawyer.subscriptionId) {
            const currentPlan = await this.subscriptionRepository.findById(lawyer.subscriptionId);
            const newPlan = await this.subscriptionRepository.findById(dto.subscriptionId);

            if (currentPlan && newPlan) {
                const getMonths = (duration: number, unit: string) => {
                    return unit === 'year' ? duration * 12 : duration;
                };

                const currentMonths = getMonths(currentPlan.duration, currentPlan.durationUnit);
                const newMonths = getMonths(newPlan.duration, newPlan.durationUnit);

                if (newMonths < currentMonths) {
                    throw new Error("You cannot downgrade to a shorter duration plan.");
                }
            }
        }

        return await this.stripeService.createSubscriptionCheckoutSession(
            dto.lawyerId,
            dto.email,
            dto.planName,
            dto.price,
            dto.subscriptionId
        );
    }
}

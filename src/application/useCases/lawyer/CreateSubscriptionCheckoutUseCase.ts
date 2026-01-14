import { IPaymentService } from "../../interface/services/IPaymentService";
import { ICreateSubscriptionCheckoutUseCase } from "../../interface/use-cases/lawyer/ICreateSubscriptionCheckoutUseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { CreateSubscriptionCheckoutDTO } from "../../dtos/lawyer/CreateSubscriptionCheckoutDTO";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class CreateSubscriptionCheckoutUseCase implements ICreateSubscriptionCheckoutUseCase {
    constructor(
        private _paymentService: IPaymentService,
        private _lawyerRepository: ILawyerRepository,
        private _subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(dto: CreateSubscriptionCheckoutDTO): Promise<string> {
        const lawyer = await this._lawyerRepository.findById(dto.lawyerId);
        if (!lawyer) throw new NotFoundError("Lawyer not found");

        if (lawyer.subscriptionId) {
            const currentPlan = await this._subscriptionRepository.findById(lawyer.subscriptionId);
            const newPlan = await this._subscriptionRepository.findById(dto.subscriptionId);

            if (currentPlan && newPlan) {
                const getMonths = (duration: number, unit: string) => {
                    return unit === 'year' ? duration * 12 : duration;
                };

                const currentMonths = getMonths(currentPlan.duration, currentPlan.durationUnit);
                const newMonths = getMonths(newPlan.duration, newPlan.durationUnit);

                if (newMonths < currentMonths) {
                    throw new BadRequestError("You cannot downgrade to a shorter duration plan.");
                }
            }
        }

        return await this._paymentService.createSubscriptionCheckoutSession(
            dto.lawyerId,
            dto.email,
            dto.planName,
            dto.price,
            dto.subscriptionId
        );
    }
}

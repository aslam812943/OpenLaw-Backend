import { IUpdateSubscriptionUseCase } from "../../interface/use-cases/admin/IUpdateSubscriptionUseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { ConflictError } from "../../../infrastructure/errors/ConflictError";
import { UpdateSubscriptionDTO } from "../../dtos/admin/UpdateSubscriptionDTO";

export class UpdateSubscriptionUseCase implements IUpdateSubscriptionUseCase {
    constructor(private _subscriptionRepository: ISubscriptionRepository) { }

    async execute(data: UpdateSubscriptionDTO): Promise<void> {
        if (!data.id || !data.planName || !data.duration || !data.durationUnit || data.price < 50 || data.commissionPercent < 0 || data.commissionPercent > 50) {
            throw new BadRequestError("Invalid subscription data: Price must be at least 50 and Commission must be between 0 and 50.");
        }

        const existingPlan = await this._subscriptionRepository.findById(data.id);
        if (!existingPlan) {
            throw new BadRequestError("Subscription plan not found.");
        }

        const planWithSameName = await this._subscriptionRepository.findByName(data.planName);
        if (planWithSameName && planWithSameName.id !== data.id) {
            throw new ConflictError("Subscription plan with this name already exists.");
        }

        await this._subscriptionRepository.update(data.id, {
            planName: data.planName,
            duration: data.duration,
            durationUnit: data.durationUnit,
            price: data.price,
            commissionPercent: data.commissionPercent
        });
    }
}

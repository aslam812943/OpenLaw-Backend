import { IToggleSubscriptionStatusUseCase } from "../../interface/use-cases/admin/IToggleSubscriptionStatusUseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class ToggleSubscriptionStatusUseCase implements IToggleSubscriptionStatusUseCase {
    constructor(private _subscriptionRepository: ISubscriptionRepository) { }

    async execute(subscriptionId: string, status: boolean): Promise<void> {
        if (!subscriptionId) throw new BadRequestError("Subscription ID is required");

        const subscription = await this._subscriptionRepository.findById(subscriptionId);
        if (!subscription) {
            throw new NotFoundError("Subscription not found");
        }

        await this._subscriptionRepository.toggleStatus(subscriptionId, status);
    }
}

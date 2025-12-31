import { IToggleSubscriptionStatusUseCase } from "../../interface/use-cases/admin/IToggleSubscriptionStatusUseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class ToggleSubscriptionStatusUseCase implements IToggleSubscriptionStatusUseCase {
    constructor(private subscriptionRepository: ISubscriptionRepository) { }

    async execute(id: string, status: boolean): Promise<void> {
        if (!id) throw new Error("Subscription ID is required");
        await this.subscriptionRepository.toggleStatus(id, status);
    }
}

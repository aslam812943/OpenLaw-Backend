import { ICreateSubscriptionUseCase } from "../../interface/use-cases/admin/ICreateSubscriptionUseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { ConflictError } from "../../../infrastructure/errors/ConflictError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError"
import { CreateSubscriptionDTO } from "../../dtos/admin/CreateSubscriptionDTO";
import { Subscription } from "../../../domain/entities/Subscription";




export class CreateSubscriptionUseCase implements ICreateSubscriptionUseCase {
    constructor(private _subscriptionRepository: ISubscriptionRepository) { }
    async execute(subscriptionData: CreateSubscriptionDTO): Promise<void> {


        if (
            !subscriptionData.planName ||
            !subscriptionData.duration ||
            !subscriptionData.durationUnit ||
            subscriptionData.price < 50 ||
            subscriptionData.commissionPercent === undefined ||
            subscriptionData.commissionPercent === null ||
            isNaN(subscriptionData.commissionPercent) ||
            subscriptionData.commissionPercent < 0 ||
            subscriptionData.commissionPercent > 50 ||
            subscriptionData.lawyerCancellationPenaltyPercent === undefined ||
            subscriptionData.lawyerCancellationPenaltyPercent === null ||
            isNaN(subscriptionData.lawyerCancellationPenaltyPercent) ||
            subscriptionData.lawyerCancellationPenaltyPercent < 0 ||
            subscriptionData.lawyerCancellationPenaltyPercent > 10
        ) {
            throw new BadRequestError("Invalid subscription data: Price >= 50, Commission 0-50%, and Cancellation Penalty 0-10%.");
        }


        try {
            const subscription = new Subscription(
                '',
                subscriptionData.planName,
                Number(subscriptionData.duration),
                subscriptionData.durationUnit,
                Number(subscriptionData.price),
                Number(subscriptionData.commissionPercent),
                Number(subscriptionData.lawyerCancellationPenaltyPercent)
            )
            await this._subscriptionRepository.create(subscription);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
                throw new ConflictError("Subscription plan with this name already exists.");
            }
            throw error;
        }
    }

}

import { ICreateSubscriptionUseCase } from "../../interface/use-cases/admin/ICreateSubscriptionUseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { ConflictError } from "../../../infrastructure/errors/ConflictError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError"
import { CreateSubscriptionDTO } from "../../dtos/admin/CreateSubscriptionDTO";
import { Subscription } from "../../../domain/entities/Subscription";
export class CreateSubscriptionUseCase implements ICreateSubscriptionUseCase {
    constructor(private subscriptionRepository: ISubscriptionRepository) { }
async execute(subscriptionData: CreateSubscriptionDTO): Promise<void> {
     

        if (!subscriptionData.planName || !subscriptionData.duration || !subscriptionData.durationUnit || subscriptionData.price < 0 || subscriptionData.commissionPercent < 0) {
            throw new BadRequestError("Invalid subscription data provided.");
        }

     
        try {
            const subscription = new Subscription('',subscriptionData.planName,Number(subscriptionData.duration),subscriptionData.durationUnit,Number(subscriptionData.price),Number(subscriptionData.commissionPercent))
            await this.subscriptionRepository.create(subscription);
        } catch (error: any) {
            if (error.code === 11000) { 
                throw new ConflictError("Subscription plan with this name already exists.");
            }
            throw error;
        }
}
 
}

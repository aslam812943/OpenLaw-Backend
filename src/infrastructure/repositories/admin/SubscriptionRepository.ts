import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { Subscription } from "../../../domain/entities/Subscription";
import subscriptionModel from '../../../infrastructure/db/models/admin/subscriptionModel'



export class SubscriptionRepository implements ISubscriptionRepository {
    async create(data: any): Promise<void> {
        await subscriptionModel.create(data)
    }

    async findAll(): Promise<Subscription[]> {
        const docs = await subscriptionModel.find({ isActive: true }); 
     
        const all = await subscriptionModel.find();
        return all.map((d: any) => ({
            id: d._id.toString(),
            planName: d.planName,
            duration: d.duration,
            durationUnit: d.durationUnit,
            price: d.price,
            commissionPercent: d.commissionPercent || 0 
        }));
    }
}
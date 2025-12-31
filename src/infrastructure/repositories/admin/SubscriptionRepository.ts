import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { Subscription } from "../../../domain/entities/Subscription";
import subscriptionModel from '../../../infrastructure/db/models/admin/subscriptionModel'



export class SubscriptionRepository implements ISubscriptionRepository {
    async create(data: any): Promise<void> {
        await subscriptionModel.create(data)
    }

    async findAll(): Promise<Subscription[]> {
        const all = await subscriptionModel.find();
        return all.map((d: any) => ({
            id: d._id.toString(),
            planName: d.planName,
            duration: d.duration,
            durationUnit: d.durationUnit,
            price: d.price,
            commissionPercent: d.commissionPercent || 0,
            isActive: d.isActive
        }));
    }

    async findActive(): Promise<Subscription[]> {
        const active = await subscriptionModel.find({ isActive: true });
        return active.map((d: any) => ({
            id: d._id.toString(),
            planName: d.planName,
            duration: d.duration,
            durationUnit: d.durationUnit,
            price: d.price,
            commissionPercent: d.commissionPercent || 0,
            isActive: d.isActive
        }));
    }

    async toggleStatus(id: string, status: boolean): Promise<void> {
        await subscriptionModel.findByIdAndUpdate(id, { isActive: status });
    }
}
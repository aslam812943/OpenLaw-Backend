import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { Subscription } from "../../../domain/entities/Subscription";
import subscriptionModel from '../../../infrastructure/db/models/admin/subscriptionModel'



export class SubscriptionRepository implements ISubscriptionRepository {
    async create(data: any): Promise<void> {
        await subscriptionModel.create(data)
    }

    async findAll(): Promise<Subscription[]> {
        const all = await subscriptionModel.find();
        return all.map((d: any) => this._mapToSubscription(d));
    }

    async findAllSubscription(page: number, limit: number): Promise<{ plans: Subscription[], total: number }> {
        const skip = (page - 1) * limit;
        const [plans, total] = await Promise.all([
            subscriptionModel.find().skip(skip).limit(limit).lean(),
            subscriptionModel.countDocuments()
        ]);

        return {
            plans: plans.map((d: any) => this._mapToSubscription(d)),
            total
        };
    }

    async findActive(): Promise<Subscription[]> {
        const active = await subscriptionModel.find({ isActive: true });
        return active.map((d: any) => this._mapToSubscription(d));
    }

    async toggleStatus(id: string, status: boolean): Promise<void> {
        await subscriptionModel.findByIdAndUpdate(id, { isActive: status });
    }

    async findById(id: string): Promise<Subscription | null> {
        const d: any = await subscriptionModel.findById(id);
        if (!d) return null;
        return this._mapToSubscription(d);
    }

    private _mapToSubscription(d: any): Subscription {
        return {
            id: d._id ? d._id.toString() : d.id,
            planName: d.planName,
            duration: d.duration,
            durationUnit: d.durationUnit,
            price: d.price,
            commissionPercent: d.commissionPercent || 0,
            isActive: d.isActive
        };
    }
}
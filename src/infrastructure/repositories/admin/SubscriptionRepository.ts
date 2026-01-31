import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import mongoose, { Types } from "mongoose";
import { Subscription } from "../../../domain/entities/Subscription";
import subscriptionModel from '../../../infrastructure/db/models/admin/subscriptionModel'



export class SubscriptionRepository implements ISubscriptionRepository {
    async create(data: Subscription): Promise<void> {
        await subscriptionModel.create(data)
    }

    async findAll(): Promise<Subscription[]> {
        const all = await subscriptionModel.find();
        return all.map((d: unknown) => this._mapToSubscription(d));
    }

    async findAllSubscription(page: number, limit: number): Promise<{ plans: Subscription[], total: number }> {
        const skip = (page - 1) * limit;
        const [plans, total] = await Promise.all([
            subscriptionModel.find().skip(skip).limit(limit).lean(),
            subscriptionModel.countDocuments()
        ]);

        return {
            plans: (plans as unknown[]).map((d: unknown) => this._mapToSubscription(d)),
            total
        };
    }
    async findActive(page: number, limit: number): Promise<{ plans: Subscription[]; total: number; }> {
        const skip = (page - 1) * limit;
        const [plans, total] = await Promise.all([
            subscriptionModel.find({ isActive: true }).skip(skip).limit(limit).lean(),
            subscriptionModel.countDocuments({ isActive: true })
        ]);

        return {
            plans: (plans as unknown[]).map((d: unknown) => this._mapToSubscription(d)),
            total
        };
    }

    async toggleStatus(id: string, status: boolean): Promise<void> {
        await subscriptionModel.findByIdAndUpdate(id, { isActive: status });
    }

    async update(id: string, data: Partial<Subscription>): Promise<void> {
        await subscriptionModel.findByIdAndUpdate(id, data);
    }

    async findById(id: string): Promise<Subscription | null> {
        const d = await subscriptionModel.findById(id).lean();
        if (!d) return null;
        return this._mapToSubscription(d);
    }

    async findByName(name: string): Promise<Subscription | null> {
        const d = await subscriptionModel.findOne({ planName: name }).lean();
        if (!d) return null;
        return this._mapToSubscription(d);
    }

    private _mapToSubscription(d: unknown): Subscription {
        const doc = d as {
            _id?: Types.ObjectId;
            id?: string;
            planName: string;
            duration: number;
            durationUnit: 'month' | 'year';
            price: number;
            commissionPercent?: number;
            isActive: boolean;
        };
        return {
            id: doc._id ? doc._id.toString() : (doc.id || ''),
            planName: doc.planName,
            duration: doc.duration,
            durationUnit: doc.durationUnit,
            price: doc.price,
            commissionPercent: doc.commissionPercent || 0,
            isActive: doc.isActive
        };
    }
}
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import mongoose, { Types } from "mongoose";
import { Subscription } from "../../../domain/entities/Subscription";
import subscriptionModel from '../../../infrastructure/db/models/admin/subscriptionModel'



import { BaseRepository } from "../BaseRepository";
import { MessageConstants } from "../../constants/MessageConstants";
import { InternalServerError } from "../../errors/InternalServerError";

export class SubscriptionRepository extends BaseRepository<any> implements ISubscriptionRepository {
    constructor() {
        super(subscriptionModel);
    }
    async create(data: Subscription): Promise<void> {
        try {
            await subscriptionModel.create(data);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
        }
    }

    async findAll(): Promise<Subscription[]> {
        try {
            const all = await subscriptionModel.find();
            return all.map((d: unknown) => this._mapToSubscription(d));
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async findAllSubscription(page: number, limit: number): Promise<{ plans: Subscription[], total: number }> {
        try {
            const skip = (page - 1) * limit;
            const [plans, total] = await Promise.all([
                subscriptionModel.find().skip(skip).limit(limit).lean(),
                subscriptionModel.countDocuments()
            ]);

            return {
                plans: (plans as unknown[]).map((d: unknown) => this._mapToSubscription(d)),
                total
            };
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }
    async findActive(page: number, limit: number): Promise<{ plans: Subscription[]; total: number; }> {
        try {
            const skip = (page - 1) * limit;
            const [plans, total] = await Promise.all([
                subscriptionModel.find({ isActive: true }).skip(skip).limit(limit).lean(),
                subscriptionModel.countDocuments({ isActive: true })
            ]);

            return {
                plans: (plans as unknown[]).map((d: unknown) => this._mapToSubscription(d)),
                total
            };
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async toggleStatus(id: string, status: boolean): Promise<void> {
        try {
            await subscriptionModel.findByIdAndUpdate(id, { isActive: status });
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    async update(id: string, data: Partial<Subscription>): Promise<void> {
        try {
            await subscriptionModel.findByIdAndUpdate(id, data);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    async findById(id: string): Promise<Subscription | null> {
        try {
            const d = await subscriptionModel.findById(id).lean();
            if (!d) return null;
            return this._mapToSubscription(d);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_BY_ID_ERROR);
        }
    }

    async findByName(name: string): Promise<Subscription | null> {
        try {
            const d = await subscriptionModel.findOne({ planName: name }).lean();
            if (!d) return null;
            return this._mapToSubscription(d);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_ERROR);
        }
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
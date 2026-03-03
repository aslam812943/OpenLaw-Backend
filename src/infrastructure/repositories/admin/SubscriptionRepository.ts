import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { Types } from "mongoose";
import { Subscription } from "../../../domain/entities/Subscription";
import subscriptionModel, { ISubscriptionDocument } from '../../../infrastructure/db/models/admin/subscriptionModel'
import { MessageConstants } from "../../constants/MessageConstants";
import { InternalServerError } from "../../errors/InternalServerError";
import { BaseRepository } from "../BaseRepository";

export class SubscriptionRepository extends BaseRepository<ISubscriptionDocument> implements ISubscriptionRepository {
    constructor() {
        super(subscriptionModel);
    }

    async create(data: Subscription): Promise<void> {
        try {
            await this.baseCreate(data as unknown as Partial<ISubscriptionDocument>);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
        }
    }

    async findAll(): Promise<Subscription[]> {
        try {
            const all = await this.baseFindAll();
            return all.map((d: unknown) => this._mapToSubscription(d));
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async findAllSubscription(page: number, limit: number): Promise<{ plans: Subscription[], total: number }> {
        try {
            const skip = (page - 1) * limit;
            const [plans, total] = await Promise.all([
                this.baseFindAll({}, { skip, limit, lean: true }),
                this.baseCountDocuments()
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
                this.baseFindAll({ isActive: true }, { skip, limit, lean: true }),
                this.baseCountDocuments({ isActive: true })
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
            await this.baseUpdate(id, { isActive: status });
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    async update(id: string, data: Partial<Subscription>): Promise<void> {
        try {
            await this.baseUpdate(id, data as unknown as Partial<ISubscriptionDocument>);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    async findById(id: string): Promise<Subscription | null> {
        try {
            const d = await this.baseFindById(id);
            if (!d) return null;
            return this._mapToSubscription(d);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_BY_ID_ERROR);
        }
    }

    async findByName(name: string): Promise<Subscription | null> {
        try {
            const d = await this.baseFindOne({ planName: name });
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
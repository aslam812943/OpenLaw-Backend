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
            await this.baseCreate({
                planName: data.planName,
                duration: data.duration,
                durationUnit: data.durationUnit,
                price: data.price,
                commissionPercent: data.commissionPercent,
                lawyerCancellationPenaltyPercent: data.lawyerCancellationPenaltyPercent,
                isActive: data.isActive
            } as unknown as Partial<ISubscriptionDocument>);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
        }
    }

    async findAll(): Promise<Subscription[]> {
        try {
            const all = await this.baseFindAll();
            return all.map((d: ISubscriptionDocument) => this._mapToSubscription(d as ISubscriptionDocument));
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
                plans: (plans as ISubscriptionDocument[]).map((d: ISubscriptionDocument) => this._mapToSubscription(d as ISubscriptionDocument)),
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
                plans: (plans as ISubscriptionDocument[]).map((d: ISubscriptionDocument) => this._mapToSubscription(d as ISubscriptionDocument)),
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
            const updateData: Record<string, string | number | boolean> = {};
            if (data.planName) updateData.planName = data.planName;
            if (data.duration) updateData.duration = data.duration;
            if (data.durationUnit) updateData.durationUnit = data.durationUnit;
            if (data.price !== undefined) updateData.price = data.price;
            if (data.commissionPercent !== undefined) updateData.commissionPercent = data.commissionPercent;
            if (data.lawyerCancellationPenaltyPercent !== undefined) updateData.lawyerCancellationPenaltyPercent = data.lawyerCancellationPenaltyPercent;
            if (data.isActive !== undefined) updateData.isActive = data.isActive;

            await this.baseUpdate(id, updateData);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    async findById(id: string): Promise<Subscription | null> {
        try {
            const d = await this.baseFindById(id);
            if (!d) return null;
            return this._mapToSubscription(d as ISubscriptionDocument);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_BY_ID_ERROR);
        }
    }

    async findByName(name: string): Promise<Subscription | null> {
        try {
            const d = await this.baseFindOne({ planName: name });
            if (!d) return null;
            return this._mapToSubscription(d as ISubscriptionDocument);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_ERROR);
        }
    }

    private _mapToSubscription(d: ISubscriptionDocument): Subscription {
        const id = d._id ? (d._id as Types.ObjectId).toString() : (d.id || '');
        return new Subscription(
            id,
            d.planName,
            d.duration,
            d.durationUnit,
            d.price,
            d.commissionPercent || 0,
            d.lawyerCancellationPenaltyPercent || 0,
            d.isActive
        );
    }
}
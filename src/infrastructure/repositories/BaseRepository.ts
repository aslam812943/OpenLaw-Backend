import mongoose, { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import { InternalServerError } from "../errors/InternalServerError";
import { MessageConstants } from "../constants/MessageConstants";
import { ISession } from "../../domain/interfaces/ISession";
import { MongooseSession } from "../db/MongooseDatabaseSession";

export class BaseRepository<T extends Document> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    private getNativeSession(session?: ISession): mongoose.ClientSession | undefined {
        return (session as MongooseSession)?.nativeSession;
    }

    async baseCreate(data: Partial<T>, session?: ISession): Promise<T> {
        try {
            const nativeSession = this.getNativeSession(session);
            const docs = await this.model.create([data], { session: nativeSession });
            return docs[0];
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
        }
    }

    async baseFindOne(filter: FilterQuery<T>, options: QueryOptions = {}, session?: ISession): Promise<T | null> {
        try {
            const nativeSession = this.getNativeSession(session);
            return await this.model.findOne(filter, null, { ...options, session: nativeSession }).exec();
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_ERROR);
        }
    }

    async baseFindById(id: string, session?: ISession): Promise<T | null> {
        try {
            const nativeSession = this.getNativeSession(session);
            return await this.model.findById(id).session(nativeSession || null).exec();
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_BY_ID_ERROR);
        }
    }

    async baseUpdate(id: string, data: UpdateQuery<T>, session?: ISession): Promise<T | null> {
        try {
            const nativeSession = this.getNativeSession(session);
            return await this.model.findByIdAndUpdate(id, data, { new: true, session: nativeSession }).exec();
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    async baseDelete(id: string): Promise<T | null> {
        try {
            return await this.model.findByIdAndDelete(id).exec();
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.DELETE_ERROR);
        }
    }

    async baseFindAll(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[]> {
        try {
            return await this.model.find(filter, null, options).exec();
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async baseCountDocuments(filter: FilterQuery<T> = {}): Promise<number> {
        try {
            return await this.model.countDocuments(filter).exec();
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.COUNT_ERROR);
        }
    }

    async baseExists(filter: FilterQuery<T>): Promise<boolean> {
        try {
            const count = await this.model.countDocuments(filter).exec();
            return count > 0;
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.EXISTS_ERROR);
        }
    }
}

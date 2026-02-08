import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import { InternalServerError } from "../errors/InternalServerError";
import { MessageConstants } from "../constants/MessageConstants";

export class BaseRepository<T extends Document> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async baseCreate(data: Partial<T>): Promise<T> {
        try {
            return await this.model.create(data);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
        }
    }

    async baseFindOne(filter: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOne(filter).exec();
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_ERROR);
        }
    }

    async baseFindById(id: string): Promise<T | null> {
        try {
            return await this.model.findById(id).exec();
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_BY_ID_ERROR);
        }
    }

    async baseUpdate(id: string, data: UpdateQuery<T>): Promise<T | null> {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
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

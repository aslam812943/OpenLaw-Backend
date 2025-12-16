
import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import { InternalServerError } from "../../errors/InternalServerError";

export class BaseRepository<T extends Document> {
    protected model: Model<T>;
    constructor(model: Model<T>) {
        this.model = model;
    }


   
    async create(data: Partial<T>): Promise<T> {
        try {
            return await this.model.create(data);
        } catch (error: any) {
            throw new InternalServerError("Database error while creating document.");
        }
    }

    
    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOne(filter).exec();
        } catch (error: any) {
            throw new InternalServerError("Database error while finding document.");
        }
    }


    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
        } catch (error: any) {
            throw new InternalServerError("Database error while updating document.");
        }
    }


}
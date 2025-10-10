
import { Model,Document,FilterQuery,UpdateQuery } from "mongoose";
export class BaseRepository<T extends Document>{
    protected model:Model<T>;
    constructor(model:Model<T>){
        this.model = model;
    }


    async create(data:Partial<T>):Promise<T>{
        return await this.model.create(data)
    }

    async findOne(filter:FilterQuery<T>):Promise<T|null>{
        return await this.model.findOne(filter).exec()
    }

    async update(id:string,data:UpdateQuery<T>):Promise<T|null>{
        return await this.model.findByIdAndUpdate(id,data,{new:true}).exec()
    }


}
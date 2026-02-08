import { ISpecializationRepository } from "../../../domain/repositories/ISpecializationRepository";
import { Specialization } from "../../../domain/entities/Specialization";
import { SpecializationModel, ISpecializationDocument } from "../../db/models/SpecializationModel";
import { MessageConstants } from "../../constants/MessageConstants";
import { InternalServerError } from "../../errors/InternalServerError";
import { BaseRepository } from "../BaseRepository";

export class SpecializationRepository extends BaseRepository<ISpecializationDocument> implements ISpecializationRepository {
    constructor() {
        super(SpecializationModel);
    }

    async create(specialization: Specialization): Promise<Specialization> {
        try {
            const newSpec = new SpecializationModel({
                name: specialization.name,
                description: specialization.description,
                isActive: specialization.isActive
            });
            const saved = await newSpec.save();
            return this.mapToEntity(saved);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
        }
    }

    async update(id: string, specialization: Partial<Specialization>): Promise<Specialization | null> {
        try {
            const updated = await SpecializationModel.findByIdAndUpdate(
                id,
                { $set: specialization },
                { new: true }
            );
            if (!updated) return null;
            return this.mapToEntity(updated);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await SpecializationModel.findByIdAndDelete(id);
            return !!result;
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.DELETE_ERROR);
        }
    }

    async findById(id: string): Promise<Specialization | null> {
        try {
            const doc = await SpecializationModel.findById(id);
            if (!doc) return null;
            return this.mapToEntity(doc);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_BY_ID_ERROR);
        }
    }

    async findAll(): Promise<Specialization[]> {
        try {
            const docs = await SpecializationModel.find().sort({ createdAt: -1 });
            return docs.map(doc => this.mapToEntity(doc));
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async findActive(): Promise<Specialization[]> {
        try {
            const docs = await SpecializationModel.find({ isActive: true }).sort({ name: 1 });
            return docs.map(doc => this.mapToEntity(doc));
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async findByName(name: string): Promise<Specialization | null> {
        try {
            const doc = await SpecializationModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
            if (!doc) return null;
            return this.mapToEntity(doc);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_ERROR);
        }
    }

    private mapToEntity(doc: ISpecializationDocument): Specialization {
        return new Specialization(
            String(doc._id),
            doc.name,
            doc.description,
            doc.isActive
        );
    }
}

import { ISpecializationRepository } from "../../../domain/repositories/ISpecializationRepository";
import { Specialization } from "../../../domain/entities/Specialization";
import { SpecializationModel, ISpecializationDocument } from "../../db/models/SpecializationModel";

export class SpecializationRepository implements ISpecializationRepository {

    async create(specialization: Specialization): Promise<Specialization> {
        const newSpec = new SpecializationModel({
            name: specialization.name,
            description: specialization.description,
            isActive: specialization.isActive
        });
        const saved = await newSpec.save();
        return this.mapToEntity(saved);
    }

    async update(id: string, specialization: Partial<Specialization>): Promise<Specialization | null> {
        const updated = await SpecializationModel.findByIdAndUpdate(
            id,
            { $set: specialization },
            { new: true }
        );
        if (!updated) return null;
        return this.mapToEntity(updated);
    }

    async delete(id: string): Promise<boolean> {
        const result = await SpecializationModel.findByIdAndDelete(id);
        return !!result;
    }

    async findById(id: string): Promise<Specialization | null> {
        const doc = await SpecializationModel.findById(id);
        if (!doc) return null;
        return this.mapToEntity(doc);
    }

    async findAll(): Promise<Specialization[]> {
        const docs = await SpecializationModel.find().sort({ createdAt: -1 });
        return docs.map(doc => this.mapToEntity(doc));
    }

    async findActive(): Promise<Specialization[]> {
        const docs = await SpecializationModel.find({ isActive: true }).sort({ name: 1 });
        return docs.map(doc => this.mapToEntity(doc));
    }

    async findByName(name: string): Promise<Specialization | null> {
        const doc = await SpecializationModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (!doc) return null;
        return this.mapToEntity(doc);
    }

    private mapToEntity(doc: ISpecializationDocument): Specialization {
        return new Specialization(
            (doc as any)._id.toString(),
            doc.name,
            doc.description,
            doc.isActive
        );
    }
}

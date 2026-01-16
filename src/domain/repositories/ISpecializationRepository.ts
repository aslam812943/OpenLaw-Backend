import { Specialization } from "../entities/Specialization";

export interface ISpecializationRepository {
    create(specialization: Specialization): Promise<Specialization>;
    update(id: string, specialization: Partial<Specialization>): Promise<Specialization | null>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Specialization | null>;
    findAll(): Promise<Specialization[]>;
    findByName(name: string): Promise<Specialization | null>;
}

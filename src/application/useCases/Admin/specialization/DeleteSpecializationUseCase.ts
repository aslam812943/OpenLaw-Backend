import { IDeleteSpecializationUseCase } from "../../../interface/use-cases/admin/specialization/IDeleteSpecializationUseCase";
import { ISpecializationRepository } from "../../../../domain/repositories/ISpecializationRepository";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";

export class DeleteSpecializationUseCase implements IDeleteSpecializationUseCase {
    constructor(private _specializationRepository: ISpecializationRepository) { }

    async execute(id: string): Promise<boolean> {
        const deleted = await this._specializationRepository.delete(id);
        if (!deleted) {
            throw new NotFoundError("Specialization not found or could not be deleted.");
        }
        return true;
    }
}

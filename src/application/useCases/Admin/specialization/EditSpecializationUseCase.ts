import { IEditSpecializationUseCase } from "../../../interface/use-cases/admin/specialization/IEditSpecializationUseCase";
import { ISpecializationRepository } from "../../../../domain/repositories/ISpecializationRepository";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";
import { ConflictError } from "../../../../infrastructure/errors/ConflictError";
import { UpdateSpecializationDTO } from "../../../dtos/admin/specialization/UpdateSpecializationDTO";
import { SpecializationResponseDTO } from "../../../dtos/admin/specialization/SpecializationResponseDTO";
import { SpecializationMapper } from "../../../mapper/admin/SpecializationMapper";

export class EditSpecializationUseCase implements IEditSpecializationUseCase {
    constructor(private _specializationRepository: ISpecializationRepository) { }

    async execute(id: string, updates: UpdateSpecializationDTO): Promise<SpecializationResponseDTO> {
        if (updates.name) {
            const existing = await this._specializationRepository.findByName(updates.name);
            if (existing && existing.id !== id) {
                throw new ConflictError("Specialization with this name already exists.");
            }
        }

        const updatedSpec = await this._specializationRepository.update(id, updates);
        if (!updatedSpec) {
            throw new NotFoundError("Specialization not found.");
        }

        return SpecializationMapper.toDTO(updatedSpec);
    }
}

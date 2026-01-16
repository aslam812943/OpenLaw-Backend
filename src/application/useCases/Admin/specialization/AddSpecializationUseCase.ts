import { IAddSpecializationUseCase } from "../../../interface/use-cases/admin/specialization/IAddSpecializationUseCase";
import { ISpecializationRepository } from "../../../../domain/repositories/ISpecializationRepository";
import { Specialization } from "../../../../domain/entities/Specialization";
import { ConflictError } from "../../../../infrastructure/errors/ConflictError";
import { CreateSpecializationDTO } from "../../../dtos/admin/specialization/CreateSpecializationDTO";
import { SpecializationResponseDTO } from "../../../dtos/admin/specialization/SpecializationResponseDTO";
import { SpecializationMapper } from "../../../mapper/admin/SpecializationMapper";

export class AddSpecializationUseCase implements IAddSpecializationUseCase {
    constructor(private _specializationRepository: ISpecializationRepository) { }

    async execute(data: CreateSpecializationDTO): Promise<SpecializationResponseDTO> {
        const existing = await this._specializationRepository.findByName(data.name);
        if (existing) {
            throw new ConflictError("Specialization with this name already exists.");
        }

        const newSpec = new Specialization("", data.name, data.description);
        const savedSpec = await this._specializationRepository.create(newSpec);
        return SpecializationMapper.toDTO(savedSpec);
    }
}

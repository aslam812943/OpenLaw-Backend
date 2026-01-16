import { IGetSpecializationsUseCase } from "../../../interface/use-cases/admin/specialization/IGetSpecializationsUseCase";
import { ISpecializationRepository } from "../../../../domain/repositories/ISpecializationRepository";
import { SpecializationResponseDTO } from "../../../dtos/admin/specialization/SpecializationResponseDTO";
import { SpecializationMapper } from "../../../mapper/admin/SpecializationMapper";

export class GetSpecializationsUseCase implements IGetSpecializationsUseCase {
    constructor(private _specializationRepository: ISpecializationRepository) { }

    async execute(): Promise<SpecializationResponseDTO[]> {
        const specs = await this._specializationRepository.findAll();
        return SpecializationMapper.toDTOList(specs);
    }
}

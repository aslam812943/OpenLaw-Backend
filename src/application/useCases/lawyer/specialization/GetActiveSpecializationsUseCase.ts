import { IGetActiveSpecializationsUseCase } from "../../../interface/use-cases/lawyer/specialization/IGetActiveSpecializationsUseCase";
import { ISpecializationRepository } from "../../../../domain/repositories/ISpecializationRepository";
import { SpecializationResponseDTO } from "../../../dtos/admin/specialization/SpecializationResponseDTO";
import { SpecializationMapper } from "../../../mapper/admin/SpecializationMapper";

export class GetActiveSpecializationsUseCase implements IGetActiveSpecializationsUseCase {
    constructor(private _specializationRepository: ISpecializationRepository) { }

    async execute(): Promise<SpecializationResponseDTO[]> {
        const specs = await this._specializationRepository.findActive();
        return SpecializationMapper.toDTOList(specs);
    }
}

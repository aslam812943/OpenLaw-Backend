import { CreateSpecializationDTO } from "../../../../dtos/admin/specialization/CreateSpecializationDTO";
import { SpecializationResponseDTO } from "../../../../dtos/admin/specialization/SpecializationResponseDTO";

export interface IAddSpecializationUseCase {
    execute(data: CreateSpecializationDTO): Promise<SpecializationResponseDTO>;
}

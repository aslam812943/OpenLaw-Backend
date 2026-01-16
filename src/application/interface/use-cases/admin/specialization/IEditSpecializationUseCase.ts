import { UpdateSpecializationDTO } from "../../../../dtos/admin/specialization/UpdateSpecializationDTO";
import { SpecializationResponseDTO } from "../../../../dtos/admin/specialization/SpecializationResponseDTO";

export interface IEditSpecializationUseCase {
    execute(id: string, updates: UpdateSpecializationDTO): Promise<SpecializationResponseDTO>;
}

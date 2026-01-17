import { SpecializationResponseDTO } from "../../../../dtos/admin/specialization/SpecializationResponseDTO";

export interface IGetActiveSpecializationsUseCase {
    execute(): Promise<SpecializationResponseDTO[]>;
}

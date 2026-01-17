import { SpecializationResponseDTO } from "../../../../dtos/admin/specialization/SpecializationResponseDTO";

export interface IGetSpecializationsUseCase {
    execute(): Promise<SpecializationResponseDTO[]>;
}

import { Specialization } from "../../../domain/entities/Specialization";
import { SpecializationResponseDTO } from "../../dtos/admin/specialization/SpecializationResponseDTO";

export class SpecializationMapper {
    static toDTO(specialization: Specialization): SpecializationResponseDTO {
        return new SpecializationResponseDTO(
            specialization.id,
            specialization.name,
            specialization.description,
            specialization.isActive
        );
    }

    static toDTOList(specializations: Specialization[]): SpecializationResponseDTO[] {
        return specializations.map(s => this.toDTO(s));
    }
}

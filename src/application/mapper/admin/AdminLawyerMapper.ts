import { Lawyer } from "../../../domain/entities/Lawyer";
import { GetAllLawyerDTO, IGetAllLawyerDTO } from "../../dtos/admin/GetAllLawyerDTO";

export class AdminLawyerMapper {
  static toAllLawyerDTO(lawyer: Lawyer): GetAllLawyerDTO {

    const dto: IGetAllLawyerDTO = {
      id: lawyer.id!,
      name: lawyer.name,
      email: lawyer.email,
      phone: String(lawyer.phone ?? "0"),
      barNumber: lawyer.barNumber ?? "",
      barAdmissionDate: lawyer.barAdmissionDate ?? "",
      yearsOfPractice: lawyer.yearsOfPractice ?? 0,
      practiceAreas: lawyer.practiceAreas || [],
      languages: lawyer.languages || [],
      documentUrls: lawyer.documentUrls || [],




      addressObject: lawyer.addresses
        ? {
          address: lawyer.addresses.address,
          city: lawyer.addresses.city,
          state: lawyer.addresses.state,
          pincode: lawyer.addresses.pincode,
        }
        : undefined,

      verificationStatus: lawyer.verificationStatus,
      isVerified: lawyer.isVerified,
      isBlock: lawyer.isBlock,
    };

    return new GetAllLawyerDTO(dto);
  }

  static toAllLawyerListDTO(lawyers: Lawyer[]): GetAllLawyerDTO[] {
    return lawyers.map(AdminLawyerMapper.toAllLawyerDTO);
  }
}

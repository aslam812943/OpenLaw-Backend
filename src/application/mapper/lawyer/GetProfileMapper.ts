import { Lawyer } from "../../../domain/entities/Lawyer";
import { ResponseGetProfileDTO } from "../../dtos/lawyer/ResponseGetProfileDTO";

export class GetProfileMapper {
  static toDTO(data: Lawyer): ResponseGetProfileDTO {


    const addressArray = data.addresses
      ? [
        data.addresses.address,
        data.addresses.city,
        data.addresses.state,
        data.addresses.pincode
      ]
      : [];

    const response = new ResponseGetProfileDTO(
      data.barNumber,
      data.barAdmissionDate,
      data.yearsOfPractice,
      data.practiceAreas,
      data.languages,
      data.documentUrls,
      addressArray,
      data.user?.name ?? "",
      data.user?.email ?? "",
      data.user?.phone ?? 0,
      data.profileImage,
      data.bio
    );

    return response;
  }
}

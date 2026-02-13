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
      data.id ?? "",
      data.barNumber ?? "",
      data.barAdmissionDate ?? "",
      data.yearsOfPractice ?? 0,
      data.practiceAreas ?? [],
      data.languages ?? [],
      data.documentUrls ?? [],
      addressArray,
      data.name,
      data.email,
      data.phone ?? 0,
      data.profileImage ?? "",
      data.bio ?? "",
      data.isPassword ?? false,
      data.paymentVerify ?? false,
      Number(data.consultationFee) ?? 0,
      data.hasSubmittedVerification ?? false,
      data.verificationStatus,
      data.isBlock ?? false,
      data.isVerified ?? false,
      data.isAdminVerified ?? false
    );

    return response;
  }
}

import { Lawyer } from "../../../domain/entities/Lawyer";
import { ResponseGetProfileDTO } from "../../dtos/lawyer/ResponseGetProfileDTO";

export class GetProfileMapper {
  static toDTO(data: Lawyer): ResponseGetProfileDTO {


    const addressObject = data.addresses
      ? {
        address: data.addresses.address,
        city: data.addresses.city,
        state: data.addresses.state,
        pincode: data.addresses.pincode
      }
      : {};

    const response = new ResponseGetProfileDTO(
      data.id ?? "",
      data.barNumber ?? "",
      data.barAdmissionDate ?? "",
      data.yearsOfPractice ?? 0,
      data.practiceAreas ?? [],
      data.languages ?? [],
      data.documentUrls ?? [],
      addressObject,
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

import { IUpdateProfileUseCase } from "../../interface/use-cases/lawyer/IProfileUseCases";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { UpdateLawyerProfileDTO } from "../../dtos/lawyer/UpdateLawyerProfileDTO";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";




export class UpdateProfileUseCase implements IUpdateProfileUseCase {
    constructor(private _lawyerRepository: ILawyerRepository) { }
    async execute(lawyerId: string, profileData: UpdateLawyerProfileDTO): Promise<void> {
        if (!lawyerId) throw new BadRequestError("Invalid request: lawyer ID is missing");
        if (!profileData) throw new BadRequestError('Data missing');


        const lawyer = await this._lawyerRepository.findById(lawyerId);
        if (!lawyer) throw new BadRequestError("Lawyer not found");


        if (lawyer.isBlock) {
            throw new BadRequestError("Account is blocked. Profile update is not permitted.");
        }


        if (profileData.phone) {
            const phoneNum = Number(profileData.phone);
            if (isNaN(phoneNum)) throw new BadRequestError("Invalid phone number format");

            const existingWithPhone = await this._lawyerRepository.findByPhone(phoneNum);
            if (existingWithPhone && existingWithPhone.id !== lawyerId) {
                throw new BadRequestError("This phone number is already in use by another account");
            }
        }

        if (profileData.pincode && (profileData.pincode.length !== 6 || !/^\d+$/.test(profileData.pincode))) {
            throw new BadRequestError("Invalid pincode: must be exactly 6 digits");
        }


     
        if (profileData.consultationFee === undefined || profileData.consultationFee === null) {
            throw new BadRequestError("Consultation fee is required");
        }
        if (isNaN(profileData.consultationFee) || profileData.consultationFee < 0 || profileData.consultationFee > 100000) {
            throw new BadRequestError("Invalid consultation fee: must be between 0 and 100,000");
        }

     
        if (!profileData.imageUrl && !lawyer.profileImage) {
            throw new BadRequestError("Profile photo is required");
        }

        if (profileData.name && (profileData.name.length < 3 || profileData.name.length > 50)) {
            throw new BadRequestError("Name must be between 3 and 50 characters");
        }

        if (profileData.practiceAreas && profileData.practiceAreas.length === 0) {
            throw new BadRequestError("At least one practice area is required");
        }

        if (profileData.languages && profileData.languages.length === 0) {
            throw new BadRequestError("At least one language is required");
        }

        await this._lawyerRepository.updateProfile(lawyerId, profileData)
    }
}
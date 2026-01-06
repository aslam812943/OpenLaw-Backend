import { Lawyer } from "../../../domain/entities/Lawyer";
import { ResponseGetLawyersDTO, IGetAllLawyerDTO } from "../../dtos/user/ResponseGetLawyersDTO";



export class UserLawyerMapper {
    static toGetLawyerDTO(lawyer: Lawyer): ResponseGetLawyersDTO {
        const dto: ResponseGetLawyersDTO = {
            id: lawyer.id!,
            userId: lawyer.id!, 
            name: lawyer.name,
            email: lawyer.email,
            phone: String(lawyer.phone ?? '0'),
            yearsOfPractice: lawyer.yearsOfPractice ?? 0,
            practiceAreas: lawyer.practiceAreas ?? [],
            languages: lawyer.languages ?? [],
            profileImage: lawyer.profileImage ?? '',
            consultationFee:lawyer.consultationFee??0
        }

        return dto
    }



    static toGetLawyerListDTO(lawyer: Lawyer[]): ResponseGetLawyersDTO[] {
        return lawyer.map(UserLawyerMapper.toGetLawyerDTO)
    }
}
import { LoginResponseDTO } from "../../dtos/user/LoginResponseDTO";
import { User } from '../../../domain/entities/ User'



export interface ILoginResponseMapper {
    toDTO(user: User): LoginResponseDTO;
}




export class LoginResponseMapper implements ILoginResponseMapper {
    toDTO(user: User): LoginResponseDTO {
        if (!user.id) {
            throw new Error('User id is missing');
        }
        const userResponse = new LoginResponseDTO({
            id: user.id,
            name: user.name!,
            email: user.email!,
            phone: user.phone!,
            role: user.role!,
            
            hasSubmittedVerification:user.hasSubmittedVerification
        });
        return userResponse

    }
}
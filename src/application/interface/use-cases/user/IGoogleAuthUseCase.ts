import { GoogleAuthResponseDTO } from "../../../dtos/user/GoogleAuthResponseDTO";



export interface IGoogleAuthUseCase {
    execute(idToken: string, role?: 'user' | 'lawyer'): Promise<GoogleAuthResponseDTO>;
}
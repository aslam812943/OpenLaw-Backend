import { GoogleAuthResponseDTO } from "../../../dtos/user/GoogleAuthResponseDTO";
import { UserRole } from "../../../../infrastructure/interface/enums/UserRole";

export interface IGoogleAuthUseCase {
    execute(idToken: string, role?: UserRole): Promise<GoogleAuthResponseDTO>;
}
import { User } from "../../../../domain/entities/User";
import { Lawyer } from "../../../../domain/entities/Lawyer";

export interface IVerifyOtpUseCase {
    execute(email: string, otp: string): Promise<User | Lawyer>;
}

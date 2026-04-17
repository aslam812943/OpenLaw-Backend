import { ISession } from "../../interfaces/ISession";
import { Admin } from "../../entities/Admin";



export interface IAdminRepository {
    findByEmail(email: string): Promise<Admin | null>
    createAdmin(admin: Admin): Promise<Admin>;
    updateWalletBalance(amount: number, session?: ISession): Promise<void>;
    findOne(): Promise<Admin | null>;
}
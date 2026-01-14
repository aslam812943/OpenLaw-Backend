import { Admin } from "../../entities/Admin";



export interface IAdminRepository{
    findByEmail(email:string):Promise<Admin|null>
    createAdmin(admin:Admin):Promise<Admin>;
}
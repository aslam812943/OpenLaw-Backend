import { Admin } from "../../entities/Admin";
// import { BaseRepository } from "../../../infrastructure/repositories/user/BaseRepository";



export interface IAdminRepository{
    findByEmail(email:string):Promise<Admin|null>
    createAdmin(admin:Admin):Promise<Admin>;
}
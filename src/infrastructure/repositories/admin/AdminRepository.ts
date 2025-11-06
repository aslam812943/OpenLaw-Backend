import { IAdminRepository } from "../../../domain/repositories/admin/IAdminRepository";
import { Admin } from "../../../domain/entities/Admin";
import { AdminModel } from "../../db/models/AdminModel";




export class AdminRepository implements IAdminRepository{
    async findByEmail(email: string): Promise<Admin | null> {
        const adminDoc = await AdminModel.findOne({email});
        if(!adminDoc) return null
        return new Admin(adminDoc.id,adminDoc.name,adminDoc.email,adminDoc.password)
    }


    async createAdmin(admin: Admin): Promise<Admin> {
        const newAdmin = await AdminModel.create({
            name:admin.name,
            email:admin.email,
            password:admin.password
        });
        return new Admin(newAdmin.id,newAdmin.name,newAdmin.email,newAdmin.password)
    }
}
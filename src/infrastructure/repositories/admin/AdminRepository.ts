
import { IAdminRepository } from "../../../domain/repositories/admin/IAdminRepository";
import { Admin } from "../../../domain/entities/Admin";
import { AdminModel } from "../../db/models/admin/AdminModel";
import { ConflictError } from "../../errors/ConflictError";
import { InternalServerError } from "../../errors/InternalServerError";


//  AdminRepository

export class AdminRepository implements IAdminRepository {

  // ------------------------------------------------------------
  //  findByEmail() - Fetches an admin by their email address.
  // ------------------------------------------------------------

  async findByEmail(email: string): Promise<Admin | null> {
    try {

      const adminDoc = await AdminModel.findOne({ email });


      if (!adminDoc) return null;


      return new Admin(
        adminDoc.id,
        adminDoc.name,
        adminDoc.email,
        adminDoc.password
      );
    } catch (error: any) {
 
      throw new InternalServerError("Database error while fetching admin by email.");
    }
  }

  // ------------------------------------------------------------
  // createAdmin() - Creates a new admin in the database.
  // ------------------------------------------------------------
  async createAdmin(admin: Admin): Promise<Admin> {
    try {

      const newAdmin = await AdminModel.create({
        name: admin.name,
        email: admin.email,
        password: admin.password,
      });


      return new Admin(
        newAdmin.id,
        newAdmin.name,
        newAdmin.email,
        newAdmin.password
      );
    } catch (error: any) {

      if (error.code === 11000) {
        throw new ConflictError("Admin with this email already exists.");
      }

      throw new InternalServerError("Database error while creating new admin.");
    }
  }
}

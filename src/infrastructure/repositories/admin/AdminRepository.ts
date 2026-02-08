
import { IAdminRepository } from "../../../domain/repositories/admin/IAdminRepository";
import { Admin } from "../../../domain/entities/Admin";
import { AdminModel } from "../../db/models/admin/AdminModel";
import { ConflictError } from "../../errors/ConflictError";
import { InternalServerError } from "../../errors/InternalServerError";
import { MessageConstants } from "../../constants/MessageConstants";


//  AdminRepository

import { BaseRepository } from "../BaseRepository";
import { AdminDocument } from "../../db/models/admin/AdminModel";

export class AdminRepository extends BaseRepository<AdminDocument> implements IAdminRepository {
  constructor() {
    super(AdminModel);
  }

  // ------------------------------------------------------------
  //  findByEmail() 
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
    } catch (error: unknown) {

      throw new InternalServerError(MessageConstants.REPOSITORY.EMAIL_FETCH_ERROR);
    }
  }

  // ------------------------------------------------------------
  // createAdmin() 
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
    } catch (error: unknown) {
      const err = error as { code?: number };
      if (err.code === 11000) {
        throw new ConflictError("Admin with this email already exists.");
      }

      throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
    }
  }
}

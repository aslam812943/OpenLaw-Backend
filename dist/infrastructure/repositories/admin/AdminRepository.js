"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const Admin_1 = require("../../../domain/entities/Admin");
const AdminModel_1 = require("../../db/models/AdminModel");
const ConflictError_1 = require("../../errors/ConflictError");
const InternalServerError_1 = require("../../errors/InternalServerError");
//  AdminRepository
class AdminRepository {
    // ------------------------------------------------------------
    //  findByEmail() - Fetches an admin by their email address.
    // ------------------------------------------------------------
    async findByEmail(email) {
        try {
            const adminDoc = await AdminModel_1.AdminModel.findOne({ email });
            if (!adminDoc)
                return null;
            return new Admin_1.Admin(adminDoc.id, adminDoc.name, adminDoc.email, adminDoc.password);
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while fetching admin by email.");
        }
    }
    // ------------------------------------------------------------
    // createAdmin() - Creates a new admin in the database.
    // ------------------------------------------------------------
    async createAdmin(admin) {
        try {
            const newAdmin = await AdminModel_1.AdminModel.create({
                name: admin.name,
                email: admin.email,
                password: admin.password,
            });
            return new Admin_1.Admin(newAdmin.id, newAdmin.name, newAdmin.email, newAdmin.password);
        }
        catch (error) {
            if (error.code === 11000) {
                throw new ConflictError_1.ConflictError("Admin with this email already exists.");
            }
            throw new InternalServerError_1.InternalServerError("Database error while creating new admin.");
        }
    }
}
exports.AdminRepository = AdminRepository;
//# sourceMappingURL=AdminRepository.js.map
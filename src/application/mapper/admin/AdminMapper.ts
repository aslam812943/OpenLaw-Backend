import { Admin } from "../../../domain/entities/Admin";
import  AdminLoginResponseDTO  from "../../dtos/admin/AdminLoginResponseDTO";

export class AdminMapper {
  static toLoginResponse(admin: Admin, token: string): AdminLoginResponseDTO {
    return new AdminLoginResponseDTO({
      id: admin.id!,
      name: admin.name,
      email: admin.email,
      token,
    });
  }
}

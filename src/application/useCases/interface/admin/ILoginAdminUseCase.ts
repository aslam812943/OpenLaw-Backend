import { AdminLoginRequestDTO } from "../../../dtos/admin/AdminLoginRequestDTO";
import  AdminLoginResponseDTO  from "../../../dtos/admin/AdminLoginResponseDTO";

export interface ILoginAdminUseCase {
  execute(data: AdminLoginRequestDTO): Promise<AdminLoginResponseDTO>;
}

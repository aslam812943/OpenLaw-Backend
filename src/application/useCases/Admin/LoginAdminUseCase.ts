import bcrypt from 'bcrypt'
import { ITokenService } from '../../interface/services/TokenServiceInterface'
import { NotFoundError } from '../../../infrastructure/errors/NotFoundError';
import { UnauthorizedError } from '../../../infrastructure/errors/UnauthorizedError';
import AdminLoginRequestDTO from '../../dtos/admin/AdminLoginRequestDTO'
import { IAdminRepository } from '../../../domain/repositories/admin/IAdminRepository'
import { ILoginAdminUseCase } from "../../interface/use-cases/admin/ILoginAdminUseCase";
import AdminLoginResponseDTO from '../../dtos/admin/AdminLoginResponseDTO'
import { AdminMapper } from '../../mapper/admin/AdminMapper'
import { Admin } from '../../../domain/entities/Admin'





export class LoginAdminUseCase implements ILoginAdminUseCase {
  constructor(private readonly _adminRepository: IAdminRepository,
    private readonly _tokenService: ITokenService
  ) { }
  async execute(data: AdminLoginRequestDTO): Promise<AdminLoginResponseDTO> {
    const admin = await this._adminRepository.findByEmail(data.email)

    if (!admin) throw new NotFoundError('Admin not found');

    const ispasswordValid = await bcrypt.compare(data.password, admin.password)

    if (!ispasswordValid) throw new UnauthorizedError('Invalid credentials')

    const token = this._tokenService.generateAccessToken(admin.id!, 'admin', false)
    const refreshToken = this._tokenService.generateRefreshToken(admin.id!, 'admin', false)
    return AdminMapper.toLoginResponse(admin, token, refreshToken)
  }

  async createInitialAdmin() {
    const existing = await this._adminRepository.findByEmail("admin123@gmail.com");
    if (!existing) {
      const hashed = await bcrypt.hash("Admin@bct200", 10);
      const admin = new Admin(null, "Aslam", "admin123@gmail.com", hashed);
      await this._adminRepository.createAdmin(admin);

    } else {
      console.log(" Admin already exists");
    }
  }

}
import bcrypt from 'bcrypt'
import { IAdminUseCase } from '../../interface/use-cases/IAdminUseCase'
import { IJwtService } from '../../interface/services/IJwtService'
import LoginDTO from '../../dtos/admin/LoginDTO'
import { IAdminRepository } from '../../../domain/repositories/admin/IAdminRepository'
import { Admin } from '../../../domain/entities/Admin'
import jwt from 'jsonwebtoken';




export class LoginAdminUseCase implements IAdminUseCase {
    constructor(private readonly adminRepository: IAdminRepository,
        // private readonly jwtSerivice: IJwtService
    ) { }
    async loginAdmin(data: LoginDTO): Promise<{ token: string; name: string; email: string }> {
        const admin = await this.adminRepository.findByEmail(data.email)

        if (!admin) throw new Error('Admin not found');

        const ispasswordValid = await bcrypt.compare(data.password, admin.password)

        if (!ispasswordValid) throw new Error('Invalid credentials')


       const token = jwt.sign(
             { id: admin.id, email: admin.email },
             process.env.JWT_SECRET as string,
             { expiresIn: '15m' } // Short-lived token
           );
        return {
            token,
            name: admin.name,
            email: admin.email
        }
    }

 async createInitialAdmin() {
    const existing = await this.adminRepository.findByEmail("admin123@gmail.com");
    if (!existing) {
      const hashed = await bcrypt.hash("Admin@bct200", 10);
      const admin = new Admin(null, "Aslam", "admin123@gmail.com", hashed);
      await this.adminRepository.createAdmin(admin);

    } else {
      console.log(" Admin already exists");
    }
  }

}
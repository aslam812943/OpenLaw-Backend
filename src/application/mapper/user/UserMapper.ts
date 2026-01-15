import { UserRegisterDTO } from "../../dtos/user/RegisterUserDTO";
import { User } from "../../../domain/entities/User";
import { UserRole } from "../../../infrastructure/interface/enums/UserRole";

export class UserMapper {
  static toEntity(dto: UserRegisterDTO): User {
    return {
      name: dto.name,
      email: dto.email,
      password: String(dto.password),
      phone: Number(dto.phone),
      isVerified: dto.isVerified ?? false,
      role: (dto.role as UserRole) ?? UserRole.USER,
      isBlock: dto.isBlock,
      hasSubmittedVerification: false
    };
  }
}

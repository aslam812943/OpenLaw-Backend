import { UserRegisterDTO } from "../../dtos/user/ RegisterUserDTO";
import { User } from "../../../domain/entities/ User";

export class UserMapper {
    static toEntity(dto: UserRegisterDTO): User {
    return {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      isVerified: dto.isVerified ?? false,
      role: dto.role ?? "user",
      isBlock:dto.isBlock,
      hasSubmittedVerification: false
    };
  }
}

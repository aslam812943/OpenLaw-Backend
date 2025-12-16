
import { User } from "../../entities/ User";
import { UserRegisterDTO } from "../../../application/dtos/user/RegisterUserDTO";
import { GetAllUserDTO } from "../../../application/dtos/admin/GetAllUserDTO";

export interface IUserRepository {
  createUser(user: UserRegisterDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  verifyUser(userId: string): Promise<void>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>
  markVerificationSubmitted(userId: string): Promise<void>;


  findAll(
    page: number,
    limit: number
  ): Promise<{ users: User[]; total: number }>;
  blockUser(id: string): Promise<void>
  unBlockUser(id: string): Promise<void>;
  findById(id: string): Promise<User>;
  changePassword(id: string, oldPassword: string, newPassword: string): Promise<void>
  profileUpdate(id: string, name: string, phone: string, imgurl: string, address: string, city: string, state: string, pincode: string): Promise<void>
  findByGoogleId(googleId: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
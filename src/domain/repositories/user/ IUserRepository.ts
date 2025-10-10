
import { User } from "../../entities/ User";
import { UserRegisterDTO } from "../../../application/dtos/user/ RegisterUserDTO";

export interface IUserRepository {
  createUser(user: UserRegisterDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  verifyUser(userId:string):Promise<void>;
  updateUserPassword(userId:string,hashedPassword:string):Promise<void>
}
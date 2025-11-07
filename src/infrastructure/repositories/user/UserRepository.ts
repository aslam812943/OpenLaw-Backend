import { UserRegisterDTO } from "../../../application/dtos/user/ RegisterUserDTO";
import { User } from "../../../domain/entities/ User"; 
import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository"; 
import UserModel, { IUserDocument } from "../../db/models/ UserModel";
import { BaseRepository } from "../user/BaseRepository";
import { UserMapper } from "../../../application/mapper/user/UserMapper";

export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
  constructor(){
    super(UserModel)
  }
   async verifyUser(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId,{isVerified:true});
  }
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) return null;
    return {
      id: String(userDoc._id),
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      phone: userDoc.phone,
      isVerified: userDoc.isVerified,
      role: userDoc.role,
      isBlock:userDoc.isBlock,
       hasSubmittedVerification: userDoc.hasSubmittedVerification ?? false, 
    };
  }

  async createUser(user: UserRegisterDTO): Promise<User> {
    const userDoc = new UserModel(user);
    await userDoc.save();
    return {
      id: String(userDoc._id),
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      phone: userDoc.phone,
      isVerified: userDoc.isVerified,
      role: userDoc.role,
      isBlock:userDoc.isBlock,
      hasSubmittedVerification: userDoc.hasSubmittedVerification ?? false, 
    };
  }


async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await this.update(userId, { password: hashedPassword });
  }



    async markVerificationSubmitted(userId: string): Promise<void> {
    await this.update(userId, { hasSubmittedVerification: true });
  }



  async findAll(): Promise<any> {
    const docs = await UserModel.find({role:'user'})
    return docs.map(UserMapper.toEntity)
  }
}

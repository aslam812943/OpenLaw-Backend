
import { UserRegisterDTO } from "../../../application/dtos/user/RegisterUserDTO";
import { User } from "../../../domain/entities/ User";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import UserModel, { IUserDocument } from "../../db/models/ UserModel";
import { BaseRepository } from "../user/BaseRepository";
import bcrypt from "bcrypt";
import { ConflictError } from "../../errors/ConflictError";
import { InternalServerError } from "../../errors/InternalServerError";
import { NotFoundError } from "../../errors/NotFoundError";


//  UserRepository

export class UserRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  // ------------------------------------------------------------
  //  verifyUser() - Marks a user as verified.
  // ------------------------------------------------------------

  async verifyUser(userId: string): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(userId, { isVerified: true });
    } catch (error: any) {
      throw new InternalServerError("Database error while verifying user.");
    }
  }

  // ------------------------------------------------------------
  //  findByEmail() - Finds a user by their email.
  // ------------------------------------------------------------

  async findByEmail(email: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findOne({ email });
      if (!userDoc) return null;

      return {
        id: String(userDoc._id),
        name: userDoc.name,
        email: userDoc.email,
        password: userDoc.password,
        phone: Number(userDoc.phone),
        isVerified: userDoc.isVerified,
        role: userDoc.role,
        isBlock: userDoc.isBlock,
        hasSubmittedVerification: userDoc.hasSubmittedVerification ?? false,
        isPassword: userDoc.password ? true : false
      };
    } catch (error: any) {
      throw new InternalServerError("Database error while fetching user by email.");
    }
  }

  // ------------------------------------------------------------
  //  createUser() - Creates a new user.
  // ------------------------------------------------------------
  async createUser(user: UserRegisterDTO): Promise<User> {
    try {
      const userDoc = new UserModel(user);
      await userDoc.save();


      return {
        id: String(userDoc._id),
        name: userDoc.name,
        email: userDoc.email,
        password: String(userDoc.password),
        phone: Number(userDoc.phone),
        isVerified: userDoc.isVerified,
        role: userDoc.role,
        isBlock: userDoc.isBlock,
        hasSubmittedVerification: userDoc.hasSubmittedVerification ?? false,
      };
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictError("A user with this email already exists.");
      }
      throw new InternalServerError("Database error while creating a new user.");
    }
  }

  // ------------------------------------------------------------
  // updateUserPassword() - Updates a user's password.
  // ------------------------------------------------------------
  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    try {
      await this.update(userId, { password: hashedPassword });
    } catch (error: any) {
      throw new InternalServerError("Database error while updating user password.");
    }
  }

  // ------------------------------------------------------------
  //  markVerificationSubmitted() - Marks that a user has submitted verification details.
  // ------------------------------------------------------------
  async markVerificationSubmitted(userId: string): Promise<void> {
    try {
      await this.update(userId, { hasSubmittedVerification: true });
    } catch (error: any) {
      throw new InternalServerError("Database error while marking verification submission.");
    }
  }

  // ------------------------------------------------------------
  //  findAll() - Finds all users with pagination.
  // ------------------------------------------------------------
  async findAll(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [docs, total] = await Promise.all([
        UserModel.find({ role: "user" }).skip(skip).limit(limit).exec(),
        UserModel.countDocuments({ role: "user" }),
      ]);

      const users = docs.map((doc) => this.mapToDomain(doc));
      return { users, total };
    } catch (error: any) {
      throw new InternalServerError("Database error while fetching paginated users.");
    }
  }

  // ------------------------------------------------------------
  //  blockUser() - Blocks a user.
  // ------------------------------------------------------------
  async blockUser(id: string): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(id, { isBlock: true });
    } catch (error: any) {
      throw new InternalServerError("Database error while blocking user.");
    }
  }

  // ------------------------------------------------------------
  // unBlockUser() - Unblocks a user.
  // ------------------------------------------------------------
  async unBlockUser(id: string): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(id, { isBlock: false });
    } catch (error: any) {
      throw new InternalServerError("Database error while unblocking user.");
    }
  }


  private mapToDomain(doc: IUserDocument): User {
    return {
      id: String(doc._id),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      phone: Number(doc.phone),
      isVerified: doc.isVerified,
      role: doc.role,
      isBlock: doc.isBlock,
      hasSubmittedVerification: doc.hasSubmittedVerification ?? false,
      googleId: doc.googleId,
    };
  }

  async findById(id: string): Promise<User> {
    try {
      const doc = await UserModel.findById(id);
      if (!doc) throw new Error('User document not found ');
      return {
        id: String(doc._id),
        name: doc.name,
        email: doc.email,
        password: doc.password,
        phone: Number(doc.phone),
        isVerified: doc.isVerified,
        role: doc.role,
        isBlock: doc.isBlock,
        hasSubmittedVerification: doc.hasSubmittedVerification ?? false,
        profileImage: doc.profileImage ?? '',
        address: doc.address,
        isPassword: doc.password ? true : false
      };
    } catch (error: any) {
      throw new InternalServerError('findById failed: ' + (error.message || error));
    }
  }

  async changePassword(id: string, oldPass: string, newPass: string) {
    try {
      const user = await UserModel.findById(id);
      if (!user) throw new Error('User not found ');

      const match = await bcrypt.compare(oldPass, String(user.password));
      if (!match) throw new Error('Incorrect old password ');

      user.password = await bcrypt.hash(newPass, 10);
      await user.save();
    } catch (error: any) {
      throw new InternalServerError('changePassword failed: ' + (error.message || error));
    }
  }


  async profileUpdate(id: string, name: string, phone: string, imgurl: string, address: string, city: string, state: string, pincode: string): Promise<void> {
    try {
      const user = await UserModel.findById(id)
      if (!user) throw new Error('user not found')
      user.name = name
      user.phone = Number(phone)
      if (imgurl) {
        user.profileImage = imgurl
      }
      if (!user.address) {
        user.address = {
          address: "",
          city: "",
          state: '',
          pincode: 0
        };
      }
      user.address.address = address;
      user.address.city = city;
      user.address.state = state;
      user.address.pincode = Number(pincode);
      await user.save()
    } catch (error: any) {
      throw new InternalServerError("Database error while updating profile.");
    }
  }



  async findByGoogleId(googleId: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ googleId });
    if (!userDoc) return null;
    return this.mapToDomain(userDoc);
  }

  async save(user: User): Promise<User> {
    if (!user.id) throw new Error("User ID is required for update");

    const updateData: any = { ...user };
    delete updateData.id;

    if (user.address) {
      updateData.address = user.address;
      delete updateData.address;


    }




    if (user.profileImage) {
      updateData.profileImage = user.profileImage
    }

    const updatedDoc = await UserModel.findByIdAndUpdate(user.id, updateData, { new: true });
    if (!updatedDoc) throw new NotFoundError("User not found for update");

    return this.mapToDomain(updatedDoc);
  }
}
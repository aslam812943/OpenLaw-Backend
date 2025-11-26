
import { UserRegisterDTO } from "../../../application/dtos/user/ RegisterUserDTO";
import { User } from "../../../domain/entities/ User";
import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import UserModel, { IUserDocument } from "../../db/models/ UserModel";
import { BaseRepository } from "../user/BaseRepository";
import bcrypt from "bcrypt";


//  UserRepository

export class UserRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  // ------------------------------------------------------------
  //  verifyUser()
  // ------------------------------------------------------------

  async verifyUser(userId: string): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(userId, { isVerified: true });
    } catch (error: any) {
      throw new Error("Database error while verifying user.");
    }
  }

  // ------------------------------------------------------------
  //  findByEmail()
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
      };
    } catch (error: any) {

      throw new Error("Database error while fetching user by email.");
    }
  }

  // ------------------------------------------------------------
  //  createUser()
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

        throw new Error("A user with this email already exists.");
      }

      throw new Error("Database error while creating a new user.");
    }
  }

  // ------------------------------------------------------------
  // updateUserPassword()
  // ------------------------------------------------------------
  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    try {
      await this.update(userId, { password: hashedPassword });
    } catch (error: any) {

      throw new Error("Database error while updating user password.");
    }
  }

  // ------------------------------------------------------------
  //  markVerificationSubmitted()
  // ------------------------------------------------------------
  async markVerificationSubmitted(userId: string): Promise<void> {
    try {
      await this.update(userId, { hasSubmittedVerification: true });
    } catch (error: any) {
      throw new Error("Database error while marking verification submission.");
    }
  }

  // ------------------------------------------------------------
  //  findAll()
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

      throw new Error("Database error while fetching paginated users.");
    }
  }

  // ------------------------------------------------------------
  //  blockUser()
  // ------------------------------------------------------------
  async blockUser(id: string): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(id, { isBlock: true });
    } catch (error: any) {

      throw new Error("Database error while blocking user.");
    }
  }

  // ------------------------------------------------------------
  // unBlockUser()
  // ------------------------------------------------------------
  async unBlockUser(id: string): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(id, { isBlock: false });
    } catch (error: any) {

      throw new Error("Database error while unblocking user.");
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
        address: doc.Address
      };
    } catch (error: any) {
      throw new Error('findById failed: ' + (error.message || error));
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

      throw new Error('changePassword failed: ' + (error.message || error));
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
      if (!user.Address) {
        user.Address = {
          address: "",
          city: "",
          state: '',
          pincode: 0
        };
      }
      user.Address.address = address;
      user.Address.city = city;
      user.Address.state = state;
      user.Address.pincode = Number(pincode);
      await user.save()
    } catch (error: any) {
      console.log(error)
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
    delete updateData.id; // Don't update _id

    // Map domain fields to DB fields if necessary (e.g. address -> Address)
    if (user.address) {
      updateData.Address = user.address;
      delete updateData.address;
    }
    if (user.profileImage) {
      updateData.profileImage = user.profileImage
    }

    const updatedDoc = await UserModel.findByIdAndUpdate(user.id, updateData, { new: true });
    if (!updatedDoc) throw new Error("User not found for update");

    return this.mapToDomain(updatedDoc);
  }
}
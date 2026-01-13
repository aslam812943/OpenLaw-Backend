import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "../../interface/enums/UserRole";

export interface Address {
  address: string;
  city: string;
  state: string;
  pincode: number;
}


export interface IUserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: number;
  isVerified: boolean;
  role: UserRole;
  hasSubmittedVerification: boolean;
  isBlock: boolean;
  profileImage?: string;
  address?: Address;
  googleId?: string;
}


const AddressSchema: Schema<Address> = new Schema(
  {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: Number },
  },
  { _id: false }
);

// ------------------ User Schema ------------------
const UserSchema: Schema<IUserDocument> = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: false },

    phone: { type: Number, required: false },

    isVerified: { type: Boolean, default: false },

    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },

    hasSubmittedVerification: { type: Boolean, default: false },

    isBlock: { type: Boolean, default: false },

    profileImage: { type: String, default: "" },

    address: { type: AddressSchema },

    googleId: {
      type: String,
      unique: true,
      sparse: true,

    },
  },
  { timestamps: true }
);


export default mongoose.model<IUserDocument>("User", UserSchema);

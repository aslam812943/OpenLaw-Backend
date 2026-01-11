import { Schema, model, Document, Types } from "mongoose";

export interface ILawyerDocument extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: number;
  isVerified: boolean;
  role: string;
  hasSubmittedVerification: boolean;
  isBlock: boolean;
  googleId?: string;

  barNumber: string;
  barAdmissionDate: string;
  yearsOfPractice: number;
  practiceAreas: string[];
  languages: string[];
  documentUrls: string[];
  dateOfBirth?: string;
  verificationStatus?: string;
  isAdminVerified: boolean;
  Address: Address;
  Profileimageurl: string;
  bio?: string;
  paymentVerify?: boolean
  subscriptionId?: Types.ObjectId
  subscriptionStartDate?: Date;
  subscriptionExpiryDate?: Date;
  consultationFee: number;
  walletBalance: number;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  pincode: number;
}

const AddressSchema: Schema<Address> = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: Number, required: true },
}, { _id: false });

const LawyerSchema = new Schema<ILawyerDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  phone: { type: Number, required: false },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: "lawyer" },
  hasSubmittedVerification: { type: Boolean, default: false },
  isBlock: { type: Boolean, default: false },
  googleId: { type: String, unique: true, sparse: true },

  barNumber: { type: String, required: false },
  barAdmissionDate: { type: String, required: false },
  yearsOfPractice: { type: Number, required: false },
  practiceAreas: { type: [String], required: false },
  languages: { type: [String], required: false },
  documentUrls: { type: [String], required: false },
  dateOfBirth: { type: String },
  verificationStatus: { type: String, default: 'pending' },
  isAdminVerified: { type: Boolean, default: false },
  Address: { type: AddressSchema },
  Profileimageurl: { type: String },
  bio: { type: String },
  paymentVerify: { type: Boolean, default: false },
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
  subscriptionStartDate: { type: Date },
  subscriptionExpiryDate: { type: Date },
  consultationFee: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 }

}, { timestamps: true });

export default model<ILawyerDocument>("Lawyer", LawyerSchema);

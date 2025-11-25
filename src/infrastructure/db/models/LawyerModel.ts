import { Schema, model, Document, Types } from "mongoose";

export interface ILawyerDocument extends Document {

  userId: Types.ObjectId;
  barNumber: string;
  barAdmissionDate: string;
  yearsOfPractice: number;
  practiceAreas: string[];
  languages: string[];
  documentUrls: string[];
  dateOfBirth?: string;
  verificationStatus?: string;
  addresses?: string[];
  isAdminVerified: boolean
  Address: Address
  Profileimageurl: string
  bio?: string

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

  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  barNumber: { type: String, required: true },
  barAdmissionDate: { type: String, required: true },
  yearsOfPractice: { type: Number, required: true },
  practiceAreas: { type: [String], required: true },
  languages: { type: [String], required: true },
  documentUrls: { type: [String], required: true },
  dateOfBirth: { type: String },
  verificationStatus: { type: String, default: 'pending' },
  isAdminVerified: { type: Boolean, default: false },
  Address: { type: AddressSchema },
  Profileimageurl: { type: String },
  bio: { type: String }

}, { timestamps: true });

export default model<ILawyerDocument>("Lawyer", LawyerSchema);

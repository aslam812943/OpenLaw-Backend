import mongoose, { Document, Schema } from "mongoose";



export interface Address {
  address: string;
  city: string;
  state:string;
  pincode: number;
}


export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  phone: number;
  isVerified: boolean;
  role: string;
  hasSubmittedVerification:boolean
  isBlock:boolean;
 profileImage:string
 Address: Address; 
}


const AddressSchema: Schema<Address> = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state:{type:String},
  pincode: { type: Number, required: true },
}, { _id: false });



const UserSchema: Schema<IUserDocument> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: "user" },
  hasSubmittedVerification:{type:Boolean,default:false},
  isBlock:{type:Boolean,default:false},
  profileImage:{type:String},
  Address: { type: AddressSchema }
  
});

export default mongoose.model<IUserDocument>("User", UserSchema);

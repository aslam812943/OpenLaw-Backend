import mongoose, { Document, Schema } from "mongoose";


export interface AdminDocument extends Document {
    name: string;
    password: string;
    email: string;
    walletBalance: number;

}


const AdminSchema = new Schema<AdminDocument>({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    walletBalance: { type: Number, default: 0 }
}, { timestamps: true })


export const AdminModel = mongoose.model<AdminDocument>('Admin', AdminSchema);
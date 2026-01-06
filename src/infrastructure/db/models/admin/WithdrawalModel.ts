import mongoose, { Schema, Document } from "mongoose";

export interface IWithdrawalDocument extends Document {
    _id:mongoose.Types.ObjectId;
    lawyerId: mongoose.Types.ObjectId;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: Date;
    processedDate?: Date;
    commissionAmount?: number;
    finalAmount?: number;
}

const WithdrawalSchema: Schema = new Schema({
    lawyerId: { type: Schema.Types.ObjectId, ref: "Lawyer", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestDate: { type: Date, default: Date.now },
    processedDate: { type: Date },
    commissionAmount: { type: Number },
    finalAmount: { type: Number }
}, { timestamps: true });

export const WithdrawalModel = mongoose.model<IWithdrawalDocument>("Withdrawal", WithdrawalSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentDocument extends Document {
    bookingId: string;
    userId: string;
    lawyerId: string;
    amount: number;
    currency: string;
    status: string;
    transactionId: string;
    paymentMethod: string;
}

const PaymentSchema: Schema = new Schema({
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lawyerId: { type: Schema.Types.ObjectId, ref: "Lawyer", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionId: { type: String, required: true },
    paymentMethod: { type: String, required: true },
}, { timestamps: true });

export const PaymentModel = mongoose.model<IPaymentDocument>("Payment", PaymentSchema);

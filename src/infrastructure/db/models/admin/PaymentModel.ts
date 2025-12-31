import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentDocument extends Document {
    bookingId?: string;
    subscriptionId?: string;
    type?: 'booking' | 'subscription';
    userId?: string;
    lawyerId: string;
    amount: number;
    currency: string;
    status: string;
    transactionId: string;
    paymentMethod: string;
}

const PaymentSchema: Schema = new Schema({
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: false },
    subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription", required: false },
    type: { type: String, enum: ['booking', 'subscription'], default: 'booking' },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    

    lawyerId: { type: Schema.Types.ObjectId, ref: "Lawyer", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionId: { type: String, required: true },
    paymentMethod: { type: String, required: true },
}, { timestamps: true });

export const PaymentModel = mongoose.model<IPaymentDocument>("Payment", PaymentSchema);

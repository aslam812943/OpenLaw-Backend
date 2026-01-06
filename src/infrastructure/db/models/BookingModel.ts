import mongoose, { Schema, Document } from "mongoose";

export interface IBookingDocument extends Document {
    userId: string;
    lawyerId: string;
    date: string;
    startTime: string;
    endTime: string;
    consultationFee: number;
    status: string;
    paymentStatus: string;
    paymentId?: string;
    stripeSessionId?: string;
    description?: string;
    cancellationReason?: string;
    refundAmount?: number;
    refundStatus?: string;

}

const BookingSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },

    lawyerId: { type: Schema.Types.ObjectId, ref: 'Lawyer' },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    consultationFee: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentId: { type: String },
    stripeSessionId: { type: String, unique: true },
    description: { type: String },
    cancellationReason: { type: String },
    refundAmount: { type: Number },
    refundStatus: { type: String, enum: ['none', 'full', 'partial'], default: 'none' },
}, { timestamps: true });

export const BookingModel = mongoose.model<IBookingDocument>("Booking", BookingSchema);

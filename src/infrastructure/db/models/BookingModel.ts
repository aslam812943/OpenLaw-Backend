import mongoose, { Schema, Document } from "mongoose";

export interface IBookingDocument extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    lawyerId: mongoose.Types.ObjectId;
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
    isCallActive?: boolean;
    lawyerJoined?: boolean;
    commissionPercent: number;
    lawyerFeedback?: string;
    bookingId?: string;
    followUpType: 'none' | 'specific' | 'deadline';
    followUpDate?: string;
    followUpTime?: string;
    followUpStatus: 'none' | 'pending' | 'booked';
    parentBookingId?: mongoose.Types.ObjectId;
    followUpSlotId?: mongoose.Types.ObjectId;
    rescheduleCount: number;
    penaltyAmount: number;
    callDuration: number;
    lawyerCallDuration: number;
    isWarningSent: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },

    lawyerId: { type: Schema.Types.ObjectId, ref: 'Lawyer' },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    consultationFee: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected', 'follow-up'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentId: { type: String },
    stripeSessionId: { type: String, unique: true },
    description: { type: String },
    cancellationReason: { type: String },
    refundAmount: { type: Number },
    refundStatus: { type: String, enum: ['none', 'full', 'partial'], default: 'none' },
    isCallActive: { type: Boolean, default: false },
    lawyerJoined: { type: Boolean, default: false },
    commissionPercent: { type: Number, default: 0 },
    lawyerFeedback: { type: String },
    bookingId: { type: String, unique: true, sparse: true },
    followUpType: { type: String, enum: ['none', 'specific', 'deadline'], default: 'none' },
    followUpDate: { type: String },
    followUpTime: { type: String },
    followUpStatus: { type: String, enum: ['none', 'pending', 'booked'], default: 'none' },
    parentBookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    followUpSlotId: { type: Schema.Types.ObjectId, ref: 'Slot' },
    rescheduleCount: { type: Number, default: 0 },
    penaltyAmount: { type: Number, default: 0 },
    callDuration: { type: Number, default: 0 },
    lawyerCallDuration: { type: Number, default: 0 },
    isWarningSent: { type: Boolean, default: false }
}, { timestamps: true });

export const BookingModel = mongoose.model<IBookingDocument>("Booking", BookingSchema);

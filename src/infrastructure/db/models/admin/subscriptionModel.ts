import mongoose, { Schema, Document, model } from "mongoose";

export interface ISubscriptionDocument extends Document {
    planName: string;
    duration: number;
    durationUnit: string;
    price: number;
    commissionPercent: number;
    isActive: boolean;
}



const SubscriptionSchema = new Schema<ISubscriptionDocument>({
    planName: {
        type: String,
        required: true,
        unique: true
    },
    duration: {
        type: Number,
        required: true
    },
    durationUnit: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    commissionPercent: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true })


export default model<ISubscriptionDocument>('Subscription', SubscriptionSchema)
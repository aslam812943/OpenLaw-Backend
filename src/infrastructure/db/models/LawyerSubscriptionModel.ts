import { Schema, model, Document, Types } from "mongoose";

export interface ILawyerSubscriptionDocument extends Document {
    lawyerId: Types.ObjectId;
    subscriptionId: Types.ObjectId;
    startDate: Date;
    expiryDate: Date;
    paymentVerify: boolean;
    status: 'active' | 'expired' | 'upgraded';
}

const LawyerSubscriptionSchema = new Schema<ILawyerSubscriptionDocument>({
    lawyerId: { type: Schema.Types.ObjectId, ref: 'Lawyer', required: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    paymentVerify: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['active', 'expired', 'upgraded'],
        default: 'active'
    }
}, { timestamps: true });

export default model<ILawyerSubscriptionDocument>("LawyerSubscription", LawyerSubscriptionSchema);

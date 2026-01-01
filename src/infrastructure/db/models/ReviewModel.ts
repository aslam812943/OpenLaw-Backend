import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    userId: mongoose.Types.ObjectId;
    lawyerId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);

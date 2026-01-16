import mongoose, { Schema, Document } from "mongoose";

export interface ISpecializationDocument extends Document {
    name: string;
    description?: string;
    isActive: boolean;
}

const SpecializationSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        trim: true
    },
    description: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const SpecializationModel = mongoose.model<ISpecializationDocument>("Specialization", SpecializationSchema);

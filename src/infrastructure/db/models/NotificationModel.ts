import mongoose, { Schema, Document } from "mongoose";

export interface INotificationDocument extends Document {
    userId: string;
    message: string;
    type: string;
    isRead: boolean;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        message: { type: String, required: true },
        type: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        metadata: { type: Schema.Types.Mixed },
    },
    {
        timestamps: true,
    }
);

export const NotificationModel = mongoose.model<INotificationDocument>(
    "Notification",
    NotificationSchema
);

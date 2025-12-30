import { Schema, Types, Document, model } from "mongoose";


export interface IMessageDocument extends Document {
  roomId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: "user" | "lawyer";
  content: string;
  type: "text" | "image" | "video" | "document";
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  readAt?: Date | null;
  createdAt: Date;
}



const messageSchema = new Schema<IMessageDocument>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true
    },

    senderId: {
      type: Schema.Types.ObjectId,
      required: true
    },

    senderRole: {
      type: String,
      enum: ["user", "lawyer"],
      required: true
    },

    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "document"],
      default: "text"
    },
    fileUrl: {
      type: String
    },
    fileName: {
      type: String
    },
    fileSize: {
      type: String
    },
    readAt: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false,
    collection: 'messageschemas'
  }
);



export default model<IMessageDocument>('messageSchema', messageSchema);
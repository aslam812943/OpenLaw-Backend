import { Schema, Types, Document, model } from "mongoose";


export interface IMessageDocument extends Document {
  roomId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: "user" | "lawyer";
  content: string;
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
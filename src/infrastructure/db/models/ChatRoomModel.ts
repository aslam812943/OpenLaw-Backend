import mongoose, { Document, model, Schema, Types } from "mongoose";



export interface IChatRoomDocument extends Document {
  userId: Types.ObjectId;
  lawyerId: Types.ObjectId;
  bookingId: Types.ObjectId;
  isActive: boolean;
}



const chatSchema = new Schema<IChatRoomDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    lawyerId: {
      type: Schema.Types.ObjectId,
      ref: "Lawyer",
      required: true
    },

    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);




export default model<IChatRoomDocument>("ChatRoom", chatSchema);

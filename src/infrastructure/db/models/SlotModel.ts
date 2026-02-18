import { Schema, Document, Types, model } from "mongoose";

export interface ISlotModel extends Document {
  ruleId: Types.ObjectId,
  userId: Types.ObjectId,
  date: string,
  startTime: string,
  endTime: string,
  sessionType: string,
  maxBookings: number,
  isBooked: boolean,
  isReserved?: boolean,
  reservedUntil?: Date,
  reservedBy?: string,
  restrictedTo?: string
}


const SlotSchema = new Schema<ISlotModel>({
  ruleId: { type: Schema.Types.ObjectId, ref: "AvailabilityRule" },
  userId: { type: Schema.Types.ObjectId, ref: 'Lawyer' },
  date: String,
  startTime: String,
  endTime: String,
  sessionType: String,
  maxBookings: Number,
  isBooked: { type: Boolean, default: false },
  isReserved: { type: Boolean, default: false },
  reservedUntil: { type: Date },
  reservedBy: { type: String },
  restrictedTo: { type: String }
}, { timestamps: true })


export default model('Slot', SlotSchema)
import { Schema, model, Document, Types } from "mongoose";


export interface IAvailabilityRule extends Document {
   _id: Types.ObjectId;
   lawyerId: Types.ObjectId;
   title: string;
   startTime: string,
   endTime: string,
   startDate: string,
   endDate: string,
   availableDays: string[],
   bufferTime: number,
   slotDuration: number,
   maxBookings: number,
   sessionType: string,
   exceptionDays: string[],
   createdAt: Date;
   updatedAt: Date;
}


const AvailabilityRuleSchema = new Schema<IAvailabilityRule>({
   lawyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
   title: String,
   startTime: String,
   endTime: String,
   startDate: String,
   endDate: String,
   availableDays: [String],
   bufferTime: Number,
   slotDuration: Number,
   maxBookings: Number,
   sessionType: String,
   exceptionDays: [String]
}, { timestamps: true })


export default model('AvailabilityRule', AvailabilityRuleSchema)
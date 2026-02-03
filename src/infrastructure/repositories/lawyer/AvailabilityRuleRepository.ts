import { CreateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/CreateAvailabilityRuleDTO";
import { UpdateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/UpdateAvailabilityRuleDTO";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { InternalServerError } from "../../errors/InternalServerError";
import { NotFoundError } from "../../errors/NotFoundError";
import { ConflictError } from "../../errors/ConflictError";
import AvailabilityRuleModel from "../../db/models/AvailabilityRuleModel";
import SlotModel from "../../db/models/SlotModel";
import { AvailabilityRule } from "../../../domain/entities/AvailabilityRule";
import { Slot } from "../../../domain/entities/Slot";
import mongoose from "mongoose";
import { Booking } from "../../../domain/entities/Booking";
import { BookingModel } from "../../db/models/BookingModel";
import { IGeneratedSlot } from "../../../application/interface/services/ISlotGeneratorService";
interface IRuleDoc {
  _id: mongoose.Types.ObjectId;
  title: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  availableDays: string[];
  bufferTime: number;
  slotDuration: number;
  maxBookings: number;
  sessionType: 'online' | 'offline';
  exceptionDays: string[];
  lawyerId: mongoose.Types.ObjectId;
}

interface ISlotDoc {
  _id: mongoose.Types.ObjectId;
  ruleId: string;
  userId: string;
  startTime: string;
  endTime: string;
  date: string;
  sessionType: 'online' | 'offline';
  isBooked: boolean;
  bookingId?: string | null;
  maxBookings: number;
  consultationFee: number;
}

interface IBookingDoc {
  _id: mongoose.Types.ObjectId;
  userId: { _id: mongoose.Types.ObjectId; name: string };
  lawyerId: mongoose.Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  consultationFee: number;
  status: string;
  paymentStatus: string;
  paymentId: string;
  stripeSessionId: string;
  description: string;
  cancellationReason: string;
  refundAmount: number;
  refundStatus: string;
  isCallActive: boolean;
  lawyerJoined: boolean;
  commissionPercent: number;
  lawyerFeedback: string;
  createdAt: Date;
}

export class AvailabilityRuleRepository implements IAvailabilityRuleRepository {


  async createRule(rule: CreateAvailabilityRuleDTO): Promise<AvailabilityRule> {
    try {
      const doc = await AvailabilityRuleModel.create(rule);
      return this.mapToRule(doc as unknown as IRuleDoc);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
        throw new ConflictError("Availability rule already exists.");
      }
      throw new InternalServerError("Database error while creating availability rule.");
    }
  }


  async createSlots(ruleId: string, lawyerId: string, slots: IGeneratedSlot[]): Promise<Slot[]> {
    try {
      const formatted = slots.map(s => ({ ...s, ruleId, userId: lawyerId }));

      const docs = await SlotModel.insertMany(formatted);
      return docs.map(doc => this.mapToSlot(doc as unknown as ISlotDoc));
    } catch (error: unknown) {
      throw new InternalServerError("Database error while saving slots.");
    }
  }


  async updateRule(ruleId: string, updated: UpdateAvailabilityRuleDTO): Promise<AvailabilityRule> {
    try {
      const doc = await AvailabilityRuleModel.findByIdAndUpdate(ruleId, updated, { new: true });

      if (!doc) {
        throw new NotFoundError("Rule not found for update");
      }

      return this.mapToRule(doc as unknown as IRuleDoc);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError("Database error while updating rule.");
    }
  }


  async deleteSlotsByRuleId(ruleId: string): Promise<void> {
    try {
      await SlotModel.deleteMany({ ruleId });
    } catch (error: unknown) {
      throw new InternalServerError("Database error while deleting slots by rule ID.");
    }
  }

  async deleteUnbookedSlotsByRuleId(ruleId: string): Promise<void> {
    try {
      await SlotModel.deleteMany({ ruleId, isBooked: false });
    } catch (error: unknown) {
      throw new InternalServerError("Database error while deleting unbooked slots.");
    }
  }

  async getBookedSlotsByRuleId(ruleId: string): Promise<Slot[]> {
    try {
      const docs = await SlotModel.find({ ruleId, isBooked: true }).lean();
      return docs.map(doc => this.mapToSlot(doc as unknown as ISlotDoc));
    } catch (error: unknown) {
      throw new InternalServerError("Database error while fetching booked slots.");
    }
  }


  async getRuleById(ruleId: string): Promise<AvailabilityRule> {
    try {
      const doc = await AvailabilityRuleModel.findById(ruleId);

      if (!doc) {
        throw new NotFoundError("Rule not found");
      }

      return this.mapToRule(doc as unknown as IRuleDoc);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError("Database error while fetching rule.");
    }
  }


  async getAllRules(id: string): Promise<AvailabilityRule[]> {
    try {
      const docs = await AvailabilityRuleModel.find({
        lawyerId: new mongoose.Types.ObjectId(id)
      });

      return docs.map((doc: mongoose.Document) => this.mapToRule(doc as unknown as IRuleDoc));
    } catch (error: unknown) {
      throw new InternalServerError("Database error while fetching availability rules.");
    }
  }


  async deleteRuleById(ruleId: string): Promise<void> {
    try {
      const deleted = await AvailabilityRuleModel.findByIdAndDelete(ruleId);

      if (!deleted) {
        throw new Error("Rule not found to delete");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error("Failed to delete rule: " + err.message);
      }
      throw new Error("Failed to delete rule: Unknown error");
    }
  }


  async getAllSlots(lawyerId: string): Promise<Slot[]> {
    try {
      const response = await SlotModel.find({ userId: lawyerId });


      const slots = response.map((slot: mongoose.Document) => this.mapToSlot(slot as unknown as ISlotDoc));

      return slots;
    } catch (error: unknown) {

      return [];
    }
  }


  async bookSlot(id: string): Promise<void> {
    await SlotModel.findByIdAndUpdate(id, { isBooked: true })
  }



  async cancelSlot(startTime: string, lawyerId: string, date: string): Promise<void> {
    const result = await SlotModel.findOneAndUpdate(
      {
        startTime,
        userId: lawyerId,
        date,
        isBooked: true
      },
      { isBooked: false },
      { new: true }
    );

    if (!result) {
      throw new Error("Slot not found or already cancelled");
    }
  }

  async getAppoiments(lawyerId: string): Promise<Booking[]> {
    try {
      const docs = await BookingModel.find({ lawyerId })
        .populate("userId", "name")
        .lean();

      return (docs as unknown[]).map((obj: unknown) => {
        const o = obj as IBookingDoc;
        return new Booking(
          o._id.toString(),
          o.userId._id.toString(),
          o.lawyerId.toString(),
          o.date,
          o.startTime,
          o.endTime,
          o.consultationFee,
          o.status as 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected',
          o.paymentStatus as 'pending' | 'paid' | 'failed',
          o.paymentId,
          o.stripeSessionId,
          o.description,
          o.userId.name,
          o.cancellationReason,
          "",
          o.refundAmount,
          o.refundStatus as 'none' | 'full' | 'partial',
          o.isCallActive,
          o.lawyerJoined,
          o.commissionPercent,
          o.lawyerFeedback,
          o.createdAt
        );
      });

    } catch (error: unknown) {

      return [];
    }
  }

  async updateAppointmentStatus(id: string, status: string): Promise<void> {
    try {
      await BookingModel.findByIdAndUpdate(id, { status });

      if (status === 'cancelled' || status === 'rejected') {
        const booking = await BookingModel.findById(id);
        if (booking) {
          await this.cancelSlot(booking.startTime, booking.lawyerId.toString(), booking.date);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error("Failed to update appointment status: " + error.message);
      }
      throw new Error("Failed to update appointment status: Unknown error");
    }
  }

  private mapToRule(d: IRuleDoc): AvailabilityRule {
    return new AvailabilityRule(
      d._id.toString(),
      d.title,
      d.startTime,
      d.endTime,
      d.startDate,
      d.endDate,
      d.availableDays,
      d.bufferTime,
      d.slotDuration,
      d.maxBookings,
      d.sessionType,
      d.exceptionDays,
      d.lawyerId.toString()
    );
  }

  private mapToSlot(d: ISlotDoc): Slot {
    return new Slot(
      d._id.toString(),
      d.ruleId,
      d.userId,
      d.startTime,
      d.endTime,
      d.date,
      d.sessionType,
      d.isBooked,
      d.bookingId ?? null,
      d.maxBookings
    );
  }
}

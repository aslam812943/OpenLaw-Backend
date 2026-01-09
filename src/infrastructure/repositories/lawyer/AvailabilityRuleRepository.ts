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
export class AvailabilityRuleRepository implements IAvailabilityRuleRepository {

 
  async createRule(rule: CreateAvailabilityRuleDTO): Promise<any> {
    try {
      return await AvailabilityRuleModel.create(rule);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictError("Availability rule already exists.");
      }
      throw new InternalServerError("Database error while creating availability rule.");
    }
  }


  async createSlots(ruleId: string, lawyerId: string, slots: any[]): Promise<any> {
    try {
      const formatted = slots.map(s => ({ ...s, ruleId, userId: lawyerId }));

      return await SlotModel.insertMany(formatted);
    } catch (error: any) {
      throw new InternalServerError("Database error while saving slots.");
    }
  }

  
  async updateRule(ruleId: string, updated: UpdateAvailabilityRuleDTO): Promise<any> {
    try {
      const rule = await AvailabilityRuleModel.findByIdAndUpdate(ruleId, updated, { new: true });

      if (!rule) {
        throw new NotFoundError("Rule not found for update");
      }

      return rule;
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError("Database error while updating rule.");
    }
  }

 
  async deleteSlotsByRuleId(ruleId: string): Promise<void> {
    try {
      await SlotModel.deleteMany({ ruleId });
    } catch (error: any) {
      throw new InternalServerError("Database error while deleting slots by rule ID.");
    }
  }

 
  async getRuleById(ruleId: string): Promise<any> {
    try {
      const rule = await AvailabilityRuleModel.findById(ruleId);

      if (!rule) {
        throw new NotFoundError("Rule not found");
      }

      return rule;
    } catch (error: any) {
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

      return docs.map((doc: any) =>
        new AvailabilityRule(
          doc._id.toString(),
          doc.title,
          doc.startTime,
          doc.endTime,
          doc.startDate,
          doc.endDate,
          doc.availableDays,
          doc.bufferTime,
          doc.slotDuration,
          doc.maxBookings,
          doc.sessionType,
          doc.exceptionDays,
          doc.lawyerId.toString(),
          doc.consultationFee
        )
      );
    } catch (error: any) {
      throw new InternalServerError("Database error while fetching availability rules.");
    }
  }


  async deleteRuleById(ruleId: string): Promise<void> {
    try {
      const deleted = await AvailabilityRuleModel.findByIdAndDelete(ruleId);

      if (!deleted) {
        throw new Error("Rule not found to delete");
      }
    } catch (err: any) {
      throw new Error("Failed to delete rule: " + err.message);
    }
  }


  async getAllSlots(lawyerId: string): Promise<Slot[]> {
    try {
      const response = await SlotModel.find({ userId: lawyerId });


      const slots = response.map((slot: any) =>
        new Slot(
          slot._id.toString(),
          slot.ruleId,
          slot.userId,
          slot.startTime,
          slot.endTime,
          slot.date,
          slot.sessionType,
          slot.isBooked,
          slot.bookingId ?? null,
          slot.maxBookings,
          slot.consultationFee
        )
      );

      return slots;
    } catch (error) {

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

      return docs.map((obj: any) => {
        return new Booking(
          obj._id.toString(),
          obj.userId._id.toString(),
          obj.lawyerId,
          obj.date,
          obj.startTime,
          obj.endTime,
          obj.consultationFee,
          obj.status,
          obj.paymentStatus,
          obj.paymentId,
          obj.stripeSessionId,
          obj.description,
          obj.userId.name
        );
      });

    } catch (error) {

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
    } catch (error: any) {
      throw new Error("Failed to update appointment status: " + error.message);
    }
  }

}

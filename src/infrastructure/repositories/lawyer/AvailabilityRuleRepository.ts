import { CreateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/CreateAvailabilityRuleDTO";
import { UpdateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/UpdateAvailabilityRuleDTO";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { InternalServerError } from "../../errors/InternalServerError";
import { NotFoundError } from "../../errors/NotFoundError";
import { ConflictError } from "../../errors/ConflictError";
import AvailabilityRuleModel, { IAvailabilityRule } from "../../db/models/AvailabilityRuleModel";
import SlotModel, { ISlotModel } from "../../db/models/SlotModel";
import { AvailabilityRule } from "../../../domain/entities/AvailabilityRule";
import { Slot } from "../../../domain/entities/Slot";
import mongoose, { Document } from "mongoose";
import { Booking } from "../../../domain/entities/Booking";
import { BookingModel, IBookingDocument } from "../../db/models/BookingModel";
import { IGeneratedSlot } from "../../../application/interface/services/ISlotGeneratorService";
import { BaseRepository } from "../BaseRepository";

export class AvailabilityRuleRepository extends BaseRepository<IAvailabilityRule> implements IAvailabilityRuleRepository {
  constructor() {
    super(AvailabilityRuleModel);
  }

  async createRule(rule: CreateAvailabilityRuleDTO): Promise<AvailabilityRule> {
    try {
      const createData: Partial<IAvailabilityRule> = {
        ...rule,
        lawyerId: new mongoose.Types.ObjectId(rule.lawyerId)
      };
      const doc = await this.baseCreate(createData as Partial<IAvailabilityRule>);
      return this.mapToRule(doc);
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
      return docs.map(doc => this.mapToSlot(doc as unknown as ISlotModel));
    } catch (error: unknown) {
      throw new InternalServerError("Database error while saving slots.");
    }
  }


  async updateRule(ruleId: string, updated: UpdateAvailabilityRuleDTO): Promise<AvailabilityRule> {
    try {
      const doc = await this.baseUpdate(ruleId, updated as Partial<IAvailabilityRule>);

      if (!doc) {
        throw new NotFoundError("Rule not found for update");
      }

      return this.mapToRule(doc);
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
      return docs.map(doc => this.mapToSlot(doc as unknown as ISlotModel));
    } catch (error: unknown) {
      throw new InternalServerError("Database error while fetching booked slots.");
    }
  }


  async getRuleById(ruleId: string): Promise<AvailabilityRule> {
    try {
      const doc = await this.baseFindById(ruleId);

      if (!doc) {
        throw new NotFoundError("Rule not found");
      }

      return this.mapToRule(doc as unknown as IAvailabilityRule);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError("Database error while fetching rule.");
    }
  }


  async getAllRules(id: string): Promise<AvailabilityRule[]> {
    try {
      const docs = await this.baseFindAll({
        lawyerId: new mongoose.Types.ObjectId(id)
      });

      return docs.map((doc: IAvailabilityRule) => this.mapToRule(doc));
    } catch (error: unknown) {
      throw new InternalServerError("Database error while fetching availability rules.");
    }
  }


  async deleteRuleById(ruleId: string): Promise<void> {
    try {
      const deleted = await this.baseDelete(ruleId);

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


      const slots = response.map((slot: mongoose.Document) => this.mapToSlot(slot as unknown as ISlotModel));

      return slots;
    } catch (error: unknown) {

      return [];
    }
  }


  async reserveSlot(id: string, userId: string, durationMinutes: number = 15, session?: mongoose.ClientSession): Promise<boolean> {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + durationMinutes);

    const now = new Date();

    const result = await SlotModel.findOneAndUpdate(
      {
        _id: id,
        isBooked: false,
        $and: [
          {
            $or: [
              { restrictedTo: { $exists: false } },
              { restrictedTo: null },
              { restrictedTo: "" },
              { restrictedTo: userId }
            ]
          },
          {
            $or: [
              { isReserved: false },
              { isReserved: { $exists: false } },
              { reservedUntil: { $lt: now } },
              { reservedBy: userId }
            ]
          }
        ]
      },
      {
        $set: {
          isReserved: true,
          reservedUntil: expiryDate,
          reservedBy: userId
        }
      },
      { new: true, session }
    );

    return !!result;
  }


  async bookSlot(id: string, userId?: string, bookingId?: string, session?: mongoose.ClientSession): Promise<boolean> {
    const updateQuery: mongoose.UpdateQuery<ISlotModel> = { isBooked: true, isReserved: false };
    if (bookingId) {
      updateQuery.bookingId = bookingId;
    }

    const filter: mongoose.FilterQuery<ISlotModel> = { _id: id, isBooked: false };
    if (userId) {
      filter.$and = [
        { $or: [{ reservedBy: userId }, { reservedBy: { $exists: false } }, { reservedBy: null }] },
        { $or: [{ restrictedTo: userId }, { restrictedTo: { $exists: false } }, { restrictedTo: null }, { restrictedTo: "" }] }
      ];
    }

    const result = await SlotModel.findOneAndUpdate(filter, { $set: updateQuery }, { new: true, session });
    return !!result;
  }



  async cancelSlot(startTime: string, lawyerId: string, date: string): Promise<void> {
    const result = await SlotModel.findOneAndUpdate(
      {
        startTime,
        userId: lawyerId,
        date,
        isBooked: true
      },
      { isBooked: false, isReserved: false, reservedBy: undefined, reservedUntil: undefined },
      { new: true }
    );

    if (!result) {
      throw new Error("Slot not found or already cancelled");
    }
  }

  async findSlotIdByDateTime(lawyerId: string, date: string, startTime: string): Promise<string | null> {
    const slot = await SlotModel.findOne({ userId: lawyerId, date, startTime });
    return slot ? (slot._id as mongoose.Types.ObjectId).toString() : null;
  }

  async releaseSlot(id: string): Promise<void> {
    await SlotModel.findByIdAndUpdate(id, {
      $set: { isReserved: false },
      $unset: { reservedBy: "", reservedUntil: "", restrictedTo: "" }
    });
  }

  async restrictSlot(id: string, userId: string): Promise<void> {
    await SlotModel.findByIdAndUpdate(id, {
      $set: { restrictedTo: userId }
    });
  }

  async getSlotById(id: string): Promise<Slot | null> {
    const doc = await SlotModel.findById(id).lean();
    return doc ? this.mapToSlot(doc as unknown as ISlotModel) : null;
  }

  async getAppoiments(lawyerId: string): Promise<Booking[]> {
    try {
      const docs = await BookingModel.find({ lawyerId })
        .populate("userId", "name")
        .lean();

      return (docs as unknown as Array<{
        _id: mongoose.Types.ObjectId;
        userId: { _id: mongoose.Types.ObjectId; name: string } | mongoose.Types.ObjectId;
        lawyerId: mongoose.Types.ObjectId;
        date: string;
        startTime: string;
        endTime: string;
        consultationFee: number;
        status: string;
        paymentStatus: string;
        paymentId?: string;
        stripeSessionId?: string;
        description?: string;
        cancellationReason?: string;
        refundAmount?: number;
        refundStatus?: string;
        isCallActive?: boolean;
        lawyerJoined?: boolean;
        commissionPercent: number;
        lawyerFeedback?: string;
        createdAt: Date;
      }>).map((o) => {
        const userId = o.userId;
        const userIdStr = (userId && typeof userId === 'object' && '_id' in userId)
          ? String(userId._id)
          : String(userId);
        const userName = (userId && typeof userId === 'object' && 'name' in userId)
          ? userId.name
          : "Unknown";

        return new Booking(
          String(o._id),
          userIdStr,
          String(o.lawyerId),
          o.date,
          o.startTime,
          o.endTime,
          o.consultationFee,
          o.status as 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected',
          o.paymentStatus as 'pending' | 'paid' | 'failed',
          o.paymentId,
          o.stripeSessionId,
          o.description,
          userName,
          o.cancellationReason,
          "",
          o.refundAmount,
          o.refundStatus as 'none' | 'full' | 'partial',
          o.isCallActive,
          o.lawyerJoined,
          o.commissionPercent,
          o.lawyerFeedback,
          String(o.createdAt)
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

  private mapToRule(d: IAvailabilityRule): AvailabilityRule {
    return new AvailabilityRule(
      String(d._id),
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
      String(d.lawyerId)
    );
  }

  private mapToSlot(d: ISlotModel): Slot {
    return new Slot(
      String(d._id),
      String(d.ruleId),
      String(d.userId),
      d.startTime,
      d.endTime,
      d.date,
      d.sessionType,
      d.isBooked,
      d.bookingId ?? null,
      d.maxBookings,
      d.restrictedTo ?? null
    );
  }

  async releaseSlotByBookingId(bookingId: string, lawyerId?: string, date?: string, startTime?: string): Promise<void> {
    const filter: mongoose.FilterQuery<ISlotModel> = { bookingId };

    let result = await SlotModel.findOneAndUpdate(
      filter,
      {
        $set: { isBooked: false, isReserved: false, bookingId: null },
        $unset: { reservedBy: "", reservedUntil: "", restrictedTo: "" }
      }
    );

    if (!result && lawyerId && date && startTime) {
      await SlotModel.findOneAndUpdate(
        {
          userId: lawyerId,
          date,
          startTime,
          isBooked: true
        },
        {
          $set: { isBooked: false, isReserved: false, bookingId: null },
          $unset: { reservedBy: "", reservedUntil: "", restrictedTo: "" }
        }
      );
    }
  }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityRuleRepository = void 0;
const InternalServerError_1 = require("../../errors/InternalServerError");
const NotFoundError_1 = require("../../errors/NotFoundError");
const ConflictError_1 = require("../../errors/ConflictError");
const AvailabilityRuleModel_1 = __importDefault(require("../../db/models/AvailabilityRuleModel"));
const SlotModel_1 = __importDefault(require("../../db/models/SlotModel"));
const AvailabilityRule_1 = require("../../../domain/entities/AvailabilityRule");
const Slot_1 = require("../../../domain/entities/Slot");
const mongoose_1 = __importDefault(require("mongoose"));
const Booking_1 = require("../../../domain/entities/Booking");
const BookingModel_1 = require("../../db/models/BookingModel");
class AvailabilityRuleRepository {
    /**
     * Create a new availability rule
     */
    async createRule(rule) {
        try {
            return await AvailabilityRuleModel_1.default.create(rule);
        }
        catch (error) {
            if (error.code === 11000) {
                throw new ConflictError_1.ConflictError("Availability rule already exists.");
            }
            throw new InternalServerError_1.InternalServerError("Database error while creating availability rule.");
        }
    }
    /**
     * Create all slots generated for the rule
     */
    async createSlots(ruleId, lawyerId, slots) {
        try {
            const formatted = slots.map(s => ({ ...s, ruleId, userId: lawyerId }));
            return await SlotModel_1.default.insertMany(formatted);
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while saving slots.");
        }
    }
    /**
     * Update an availability rule
     */
    async updateRule(ruleId, updated) {
        try {
            const rule = await AvailabilityRuleModel_1.default.findByIdAndUpdate(ruleId, updated, { new: true });
            if (!rule) {
                throw new NotFoundError_1.NotFoundError("Rule not found for update");
            }
            return rule;
        }
        catch (error) {
            if (error instanceof NotFoundError_1.NotFoundError) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError("Database error while updating rule.");
        }
    }
    /**
     * Delete all slots generated for a rule
     */
    async deleteSlotsByRuleId(ruleId) {
        try {
            await SlotModel_1.default.deleteMany({ ruleId });
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while deleting slots by rule ID.");
        }
    }
    /**
     * Get a specific rule by ID
     */
    async getRuleById(ruleId) {
        try {
            const rule = await AvailabilityRuleModel_1.default.findById(ruleId);
            if (!rule) {
                throw new NotFoundError_1.NotFoundError("Rule not found");
            }
            return rule;
        }
        catch (error) {
            if (error instanceof NotFoundError_1.NotFoundError) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError("Database error while fetching rule.");
        }
    }
    /**
     * Get all rules belonging to a specific lawyer
     */
    async getAllRules(id) {
        try {
            const docs = await AvailabilityRuleModel_1.default.find({
                lawyerId: new mongoose_1.default.Types.ObjectId(id)
            });
            return docs.map((doc) => new AvailabilityRule_1.AvailabilityRule(doc._id.toString(), doc.title, doc.startTime, doc.endTime, doc.startDate, doc.endDate, doc.availableDays, doc.bufferTime, doc.slotDuration, doc.maxBookings, doc.sessionType, doc.exceptionDays, doc.lawyerId.toString(), doc.consultationFee));
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while fetching availability rules.");
        }
    }
    /**
     * Delete rule by ID
     */
    async deleteRuleById(ruleId) {
        try {
            const deleted = await AvailabilityRuleModel_1.default.findByIdAndDelete(ruleId);
            if (!deleted) {
                throw new Error("Rule not found to delete");
            }
        }
        catch (err) {
            throw new Error("Failed to delete rule: " + err.message);
        }
    }
    async getAllSlots(lawyerId) {
        try {
            const response = await SlotModel_1.default.find({ userId: lawyerId });
            const slots = response.map((slot) => new Slot_1.Slot(slot._id.toString(), slot.ruleId, slot.userId, slot.startTime, slot.endTime, slot.date, slot.sessionType, slot.isBooked, slot.bookingId ?? null, slot.maxBookings, slot.consultationFee));
            return slots;
        }
        catch (error) {
            return [];
        }
    }
    async bookSlot(id) {
        await SlotModel_1.default.findByIdAndUpdate(id, { isBooked: true });
    }
    async getAppoiments(lawyerId) {
        try {
            const docs = await BookingModel_1.BookingModel.find({ lawyerId })
                .populate("userId", "name")
                .lean();
            return docs.map((obj) => {
                return new Booking_1.Booking(obj._id.toString(), obj.userId._id.toString(), obj.lawyerId, obj.date, obj.startTime, obj.endTime, obj.consultationFee, obj.status, obj.paymentStatus, obj.paymentId, obj.stripeSessionId, obj.description, obj.userId.name);
            });
        }
        catch (error) {
            return [];
        }
    }
    async updateAppointmentStatus(id, status) {
        try {
            await BookingModel_1.BookingModel.findByIdAndUpdate(id, { status });
        }
        catch (error) {
            throw new Error("Failed to update appointment status: " + error.message);
        }
    }
}
exports.AvailabilityRuleRepository = AvailabilityRuleRepository;
//# sourceMappingURL=AvailabilityRuleRepository.js.map
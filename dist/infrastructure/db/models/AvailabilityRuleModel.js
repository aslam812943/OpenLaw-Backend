"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AvailabilityRuleSchema = new mongoose_1.Schema({
    lawyerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
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
    exceptionDays: [String],
    consultationFee: String
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('AvailabilityRule', AvailabilityRuleSchema);
//# sourceMappingURL=AvailabilityRuleModel.js.map
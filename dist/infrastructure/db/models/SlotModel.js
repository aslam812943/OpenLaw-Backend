"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SlotSchema = new mongoose_1.Schema({
    ruleId: { type: mongoose_1.Schema.Types.ObjectId, ref: "AvailabilityRule" },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Lawyer' },
    date: String,
    startTime: String,
    endTime: String,
    sessionType: String,
    maxBookings: Number,
    isBooked: { type: Boolean, default: false },
    consultationFee: String
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Slot', SlotSchema);
//# sourceMappingURL=SlotModel.js.map
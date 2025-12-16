"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slot = void 0;
class Slot {
    constructor(id, ruleId, userId, startTime, endTime, date, sessionType, isBooked, bookingId, maxBookings = 1, consultationFee) {
        this.id = id;
        this.ruleId = ruleId;
        this.userId = userId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.date = date;
        this.sessionType = sessionType;
        this.isBooked = isBooked;
        this.bookingId = bookingId;
        this.maxBookings = maxBookings;
        this.consultationFee = consultationFee;
    }
}
exports.Slot = Slot;
//# sourceMappingURL=Slot.js.map
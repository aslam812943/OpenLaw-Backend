"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityRule = void 0;
class AvailabilityRule {
    constructor(id, title, startTime, endTime, startDate, endDate, availableDays, bufferTime, slotDuration, maxBookings, sessionType, exceptionDays, lawyerId, consultationFee) {
        this.id = id;
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startDate = startDate;
        this.endDate = endDate;
        this.availableDays = availableDays;
        this.bufferTime = bufferTime;
        this.slotDuration = slotDuration;
        this.maxBookings = maxBookings;
        this.sessionType = sessionType;
        this.exceptionDays = exceptionDays;
        this.lawyerId = lawyerId;
        this.consultationFee = consultationFee;
    }
}
exports.AvailabilityRule = AvailabilityRule;
//# sourceMappingURL=AvailabilityRule.js.map
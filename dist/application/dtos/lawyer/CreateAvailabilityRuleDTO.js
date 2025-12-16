"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAvailabilityRuleDTO = void 0;
class CreateAvailabilityRuleDTO {
    constructor(title, startTime, endTime, startDate, endDate, availableDays, bufferTime, slotDuration, maxBookings, sessionType, exceptionDays, lawyerId, consultationFee) {
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
exports.CreateAvailabilityRuleDTO = CreateAvailabilityRuleDTO;
//# sourceMappingURL=CreateAvailabilityRuleDTO.js.map
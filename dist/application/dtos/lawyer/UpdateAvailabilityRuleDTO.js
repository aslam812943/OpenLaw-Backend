"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAvailabilityRuleDTO = void 0;
class UpdateAvailabilityRuleDTO {
    constructor(title, startTime, endTime, startDate, endDate, availableDays, bufferTime, slotDuration, maxBookings, sessionType, exceptionDays) {
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
    }
}
exports.UpdateAvailabilityRuleDTO = UpdateAvailabilityRuleDTO;
//# sourceMappingURL=UpdateAvailabilityRuleDTO.js.map
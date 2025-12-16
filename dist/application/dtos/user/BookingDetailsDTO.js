"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingDTO = void 0;
class BookingDTO {
    constructor(data) {
        this.userId = data.userId;
        this.lawyerId = data.lawyerId;
        this.lawyerName = data.lawyerName;
        this.date = data.date;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.consultationFee = data.consultationFee;
        this.description = data.description;
        this.slotId = data.slotId;
    }
}
exports.BookingDTO = BookingDTO;
//# sourceMappingURL=BookingDetailsDTO.js.map
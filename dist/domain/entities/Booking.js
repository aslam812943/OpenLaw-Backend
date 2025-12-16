"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
class Booking {
    constructor(id, userId, lawyerId, date, startTime, endTime, consultationFee, status, paymentStatus, paymentId, stripeSessionId, description, userName, cancellationReason, lawyerName) {
        this.id = id;
        this.userId = userId;
        this.lawyerId = lawyerId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.consultationFee = consultationFee;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.paymentId = paymentId;
        this.stripeSessionId = stripeSessionId;
        this.description = description;
        this.userName = userName;
        this.cancellationReason = cancellationReason;
        this.lawyerName = lawyerName;
    }
}
exports.Booking = Booking;
//# sourceMappingURL=Booking.js.map
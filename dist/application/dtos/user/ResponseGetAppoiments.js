"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseGetAppoiments = void 0;
class ResponseGetAppoiments {
    constructor(id, lawyerId, date, startTime, endTime, consultationFee, status, description, lawyerName, cancellationTeason) {
        this.id = id;
        this.lawyerId = lawyerId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.consultationFee = consultationFee;
        this.status = status;
        this.description = description;
        this.lawyerName = lawyerName;
        this.cancellationTeason = cancellationTeason;
    }
}
exports.ResponseGetAppoiments = ResponseGetAppoiments;
//# sourceMappingURL=ResponseGetAppoiments.js.map
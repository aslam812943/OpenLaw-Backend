"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAppointmentsMapper = void 0;
const ResponseGetAppoiments_1 = require("../../dtos/user/ResponseGetAppoiments");
class UserAppointmentsMapper {
    static mapToDto(data) {
        return data.map((booking) => {
            return new ResponseGetAppoiments_1.ResponseGetAppoiments(booking.id || booking._id.toString(), booking.lawyerId._id ? booking.lawyerId._id.toString() : booking.lawyerId.toString(), booking.date, booking.startTime, booking.endTime, booking.consultationFee, booking.status, booking.description, booking.lawyerName || booking.lawyerId.name || "", booking.cancellationReason);
        });
    }
}
exports.UserAppointmentsMapper = UserAppointmentsMapper;
//# sourceMappingURL=userAppoimentsMapper.js.map
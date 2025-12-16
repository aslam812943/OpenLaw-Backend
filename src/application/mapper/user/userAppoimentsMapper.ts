import { ResponseGetAppoiments } from "../../dtos/user/ResponseGetAppoiments";

export class UserAppointmentsMapper {
    static mapToDto(data: any[]): ResponseGetAppoiments[] {
        return data.map((booking) => {
            return new ResponseGetAppoiments(
                booking.id || booking._id.toString(),
                booking.lawyerId._id ? booking.lawyerId._id.toString() : booking.lawyerId.toString(),
                booking.date,
                booking.startTime,
                booking.endTime,
                booking.consultationFee,
                booking.status,
                booking.description,
                booking.lawyerName || booking.lawyerId.name || "",
                booking.cancellationReason
            );
        });
    }
}

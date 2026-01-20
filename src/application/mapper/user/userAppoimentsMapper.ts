import { ResponseGetAppointments } from "../../dtos/user/ResponseGetAppointments";

interface IBookingWithPopulatedLawyer {
    id: string;
    lawyerId: string;
    date: string;
    startTime: string;
    endTime: string;
    consultationFee: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
    description?: string;
    lawyerName?: string;
    cancellationReason?: string;
    refundAmount?: number;
    refundStatus?: 'none' | 'full' | 'partial';
    lawyerFeedback?: string;
}

export class UserAppointmentsMapper {
    static mapToDto(data: IBookingWithPopulatedLawyer[]): ResponseGetAppointments[] {
        return data.map((booking) => {
            return new ResponseGetAppointments(
                booking.id,
                booking.lawyerId,
                booking.date,
                booking.startTime,
                booking.endTime,
                booking.consultationFee,
                booking.status,
                booking.description || "",
                booking.lawyerName || "",
                booking.cancellationReason,
                booking.refundAmount,
                booking.refundStatus,
                booking.lawyerFeedback
            );
        });
    }
}

import { Booking } from "../../../domain/entities/Booking";
import { AdminBookingDTO } from "../../dtos/admin/AdminBookingDTO";

export class AdminBookingMapper {
    static toDTO(booking: Booking, commissionPercent: number): AdminBookingDTO {
        const adminCommission = booking.consultationFee * (commissionPercent / 100);
        const lawyerEarnings = booking.consultationFee - adminCommission;

        return {
            id: booking.id,
            userName: booking.userName || "N/A",
            lawyerName: booking.lawyerName || "N/A",
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            consultationFee: booking.consultationFee,
            adminCommission,
            lawyerEarnings,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            createdAt: booking.createdAt
        };
    }
}

import { Booking } from "../../../domain/entities/Booking";
import { AdminBookingDTO } from "../../dtos/admin/AdminBookingDTO";

export class AdminBookingMapper {
    static toDTO(booking: Booking, commissionPercent: number): AdminBookingDTO {
        const retainedAmount = booking.status === 'cancelled' && booking.refundStatus === 'partial'
            ? (booking.consultationFee - (booking.refundAmount || 0))
            : (booking.status === 'cancelled' && booking.refundStatus === 'full' ? 0 : booking.consultationFee);

        const adminCommission = retainedAmount * (commissionPercent / 100);
        const lawyerEarnings = retainedAmount - adminCommission;

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
            refundAmount: booking.refundAmount,
            refundStatus: booking.refundStatus,
            lawyerFeedback: booking.lawyerFeedback,
            createdAt: booking.createdAt
        };
    }
}

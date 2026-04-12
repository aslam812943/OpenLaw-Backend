import { Booking } from "../../../domain/entities/Booking";
import { GetLawyerEarningsDTO, TransactionDTO } from "../../dtos/lawyer/GetLawyerEarningsDTO";

export class LawyerEarningsMapper {
    static toDTO(bookings: Booking[], walletBalance: number, totalGross: number, pendingNet: number, totalTransactions: number): GetLawyerEarningsDTO {
        const transactions = bookings.map(b => {
            const retainedAmount = b.status === 'cancelled' && b.refundStatus === 'partial'
                ? (b.consultationFee - (b.refundAmount || 0))
                : (b.status === 'cancelled' && b.refundStatus === 'full' ? 0 : b.consultationFee);

            const commissionAmount = retainedAmount * ((b.commissionPercent || 0) / 100);
            const netAmount = retainedAmount - commissionAmount;

            return new TransactionDTO(
                b.id,
                b.date,
                b.userName || "Unknown",
                b.consultationFee,
                commissionAmount,
                netAmount,
                b.status,
                b.paymentStatus,
                b.refundAmount,
                b.refundStatus
            );
        });

        const relevantTransactions = transactions.filter(t => t.paymentStatus === 'paid' && (t.status === 'confirmed' || t.status === 'completed' || t.status === 'follow-up' || (t.status === 'cancelled' && t.netAmount > 0)));

        return new GetLawyerEarningsDTO(totalGross, relevantTransactions, walletBalance, pendingNet, totalTransactions);
    }
}

import { Booking } from "../../../domain/entities/Booking";
import { GetLawyerEarningsDTO, TransactionDTO } from "../../dtos/lawyer/GetLawyerEarningsDTO";

export class LawyerEarningsMapper {
    static toDTO(bookings: Booking[], walletBalance: number, totalGross: number, pendingNet: number): GetLawyerEarningsDTO {
        const transactions = bookings.map(b => {
            const commissionAmount = b.consultationFee * ((b.commissionPercent || 0) / 100);
            const netAmount = b.consultationFee - commissionAmount;

            return new TransactionDTO(
                b.id,
                b.date,
                b.userName || "Unknown",
                b.consultationFee,
                commissionAmount,
                netAmount,
                b.status,
                b.paymentStatus
            );
        });

        const relevantTransactions = transactions.filter(t => t.paymentStatus === 'paid' && (t.status === 'confirmed' || t.status === 'completed'));

        return new GetLawyerEarningsDTO(totalGross, relevantTransactions, walletBalance, pendingNet);
    }
}

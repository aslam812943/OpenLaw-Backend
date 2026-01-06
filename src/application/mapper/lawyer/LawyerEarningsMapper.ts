import { Booking } from "../../../domain/entities/Booking";
import { GetLawyerEarningsDTO, TransactionDTO } from "../../dtos/lawyer/GetLawyerEarningsDTO";

export class LawyerEarningsMapper {
    static toDTO(bookings: Booking[], walletBalance: number, commissionPercent: number): GetLawyerEarningsDTO {
        let total = 0;
        let pending = 0;
        const transactions = bookings.map(b => {
            const commissionAmount = b.consultationFee * (commissionPercent / 100);
            const netAmount = b.consultationFee - commissionAmount;

            
            if (b.paymentStatus === 'paid' && (b.status === 'confirmed' || b.status === 'completed')) {
                total += b.consultationFee;
            }

      
            if (b.paymentStatus === 'paid' && b.status === 'confirmed') {
                pending += netAmount;
            }

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

        return new GetLawyerEarningsDTO(total, relevantTransactions, walletBalance, pending);
    }
}

import { Booking } from "../../../domain/entities/Booking";
import { GetLawyerEarningsDTO, TransactionDTO } from "../../dtos/lawyer/GetLawyerEarningsDTO";

export class LawyerEarningsMapper {
    static toDTO(bookings: Booking[]): GetLawyerEarningsDTO {
        let total = 0;
        const transactions = bookings.map(b => {
           
            if (b.paymentStatus === 'paid'&&b.status=='confirmed') {
                total += b.consultationFee;
            }

            return new TransactionDTO(
                b.id,
                b.date,
                b.userName || "Unknown",
                b.consultationFee,
                b.status,
                b.paymentStatus
            );
        });



        const paidTransactions = transactions.filter(t => t.paymentStatus === 'paid'&&t.status=='confirmed');

        return new GetLawyerEarningsDTO(total, paidTransactions);
    }
}

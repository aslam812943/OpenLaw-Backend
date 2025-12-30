import { IPaymentRepository } from "../../domain/repositories/IPaymentRepository";
import { Payment } from "../../domain/entities/Payment";
import { PaymentModel, IPaymentDocument } from "../db/models/PaymentModel";

export class PaymentRepository implements IPaymentRepository {
    async create(payment: Payment): Promise<Payment> {
        const newPayment = await PaymentModel.create(payment);
        return this.mapToEntity(newPayment);
    }

    async findById(id: string): Promise<Payment | null> {
        const payment = await PaymentModel.findById(id);
        return payment ? this.mapToEntity(payment) : null;
    }

    async findByBookingId(bookingId: string): Promise<Payment | null> {
        const payment = await PaymentModel.findOne({ bookingId });
        return payment ? this.mapToEntity(payment) : null;
    }

    async findAll(): Promise<Payment[]> {
        const payments = await PaymentModel.find();
        return payments.map(p => this.mapToEntity(p));
    }

    private mapToEntity(doc: IPaymentDocument): Payment {
        return new Payment(
            doc._id as string,
            doc.bookingId,
            doc.userId,
            doc.lawyerId,
            doc.amount,
            doc.currency,
            doc.status as 'pending' | 'completed' | 'failed' | 'refunded',
            doc.transactionId,
            doc.paymentMethod,
            (doc as any).createdAt,
            (doc as any).updatedAt
        );
    }
}

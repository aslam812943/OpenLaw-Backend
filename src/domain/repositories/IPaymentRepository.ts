import { Payment } from "../entities/Payment";

export interface IPaymentRepository {
    create(payment: Payment): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByBookingId(bookingId: string): Promise<Payment | null>;
    findAll(): Promise<Payment[]>;
}

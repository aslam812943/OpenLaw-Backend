import { Payment } from "../entities/Payment";

export interface IPaymentRepository {
    create(payment: Partial<Payment>): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByBookingId(bookingId: string): Promise<Payment | null>;
    findByTransactionId(transactionId: string): Promise<Payment | null>;
    findAll(filters?: any): Promise<{ payments: Payment[]; total: number }>;
    getDashboardStats(startDate?: Date, endDate?: Date): Promise<any>;
    getLawyerDashboardStats(lawyerId: string, startDate?: Date, endDate?: Date): Promise<any>;
}

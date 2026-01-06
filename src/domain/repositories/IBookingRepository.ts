import { Booking } from "../entities/Booking";

export interface IBookingRepository {
    create(booking: Booking): Promise<Booking>;
    findById(id: string): Promise<Booking | null>;
    findByUserId(userId: string, page?: number, limit?: number): Promise<{ bookings: Booking[], total: number }>;
    updateStatus(id: string, status: string, reason?: string, refundDetails?: { amount: number, status: 'full' | 'partial' }): Promise<void>;
    existsByUserIdAndLawyerId(userId: string, lawyerId: string): Promise<boolean>;
    findActiveBooking(userId: string, lawyerId: string): Promise<Booking | null>;
    findByStripeSessionId(sessionId: string): Promise<Booking | null>;
    findByLawyerId(lawyerId: string): Promise<Booking[]>;
}

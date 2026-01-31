import { Booking } from "../entities/Booking";

export interface IBookingRepository {
    create(booking: Booking): Promise<Booking>;
    findById(id: string): Promise<Booking | null>;
    findByUserId(userId: string, page?: number, limit?: number, status?: string, search?: string, date?: string): Promise<{ bookings: Booking[], total: number }>;
    updateStatus(id: string, status: string, reason?: string, refundDetails?: { amount: number, status: 'full' | 'partial' }, lawyerFeedback?: string): Promise<void>;
    existsByUserIdAndLawyerId(userId: string, lawyerId: string): Promise<boolean>;
    findActiveBooking(userId: string, lawyerId: string): Promise<Booking | null>;
    findByStripeSessionId(sessionId: string): Promise<Booking | null>;
    findByLawyerId(lawyerId: string, page?: number, limit?: number, status?: string, search?: string, date?: string): Promise<{ bookings: Booking[], total: number }>;
    updateCallStatus(id: string, lawyerJoined: boolean, isCallActive?: boolean): Promise<void>;
    findAll(page?: number, limit?: number, status?: string, search?: string, date?: string): Promise<{ bookings: Booking[], total: number }>;
    getEarningsStats(lawyerId: string): Promise<{ totalGross: number, pendingNet: number }>;
}

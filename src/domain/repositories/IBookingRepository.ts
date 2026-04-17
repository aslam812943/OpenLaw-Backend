import { ISession } from "../interfaces/ISession";
import { Booking } from "../entities/Booking";

export interface IBookingRepository {
    create(booking: Booking, session?: ISession): Promise<Booking>;
    findById(id: string): Promise<Booking | null>;
    findByUserId(userId: string, page?: number, limit?: number, status?: string, search?: string, date?: string): Promise<{ bookings: Booking[], total: number }>;
    updateStatus(id: string, status: string, reason?: string, refundDetails?: { amount: number, status: 'full' | 'partial' }, lawyerFeedback?: string, session?: ISession, penaltyAmount?: number): Promise<void>;
    existsByUserIdAndLawyerId(userId: string, lawyerId: string): Promise<boolean>;
    findActiveBooking(userId: string, lawyerId: string): Promise<Booking | null>;
    findByStripeSessionId(sessionId: string): Promise<Booking | null>;
    findByLawyerId(lawyerId: string, page?: number, limit?: number, status?: string, search?: string, date?: string): Promise<{ bookings: Booking[], total: number }>;
    updateCallStatus(id: string, lawyerJoined: boolean, isCallActive?: boolean): Promise<void>;
    incrementCallDuration(id: string, seconds: number): Promise<void>;
    incrementLawyerCallDuration(id: string, seconds: number): Promise<void>;
    updateWarningStatus(id: string, isWarningSent: boolean): Promise<void>;
    findAll(page?: number, limit?: number, status?: string, search?: string, date?: string): Promise<{ bookings: Booking[], total: number }>;
    getEarningsStats(lawyerId: string): Promise<{ totalGross: number, pendingNet: number }>;
    setFollowUpDetails(id: string, followUpType: 'none' | 'specific' | 'deadline', followUpDate?: string, followUpTime?: string, lawyerFeedback?: string, followUpSlotId?: string): Promise<void>;
    findFollowUpByParentId(parentId: string): Promise<Booking | null>;
    updateFollowUpStatus(id: string, status: 'none' | 'pending' | 'booked' | 'cancelled'): Promise<void>;
    rescheduleBooking(id: string, date: string, startTime: string, endTime: string, slotId: string): Promise<void>;
}

import { Booking } from "../entities/Booking";

export interface IBookingRepository {
    create(booking: Booking): Promise<Booking>;
    findById(id: string): Promise<Booking | null>;
    findByUserId(userId: string): Promise<Booking[]>;
    updateStatus(id: string, status: string, reason?: string): Promise<void>;
}

import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { ICanJoinCallUseCase } from "../../../interface/use-cases/common/ICanJoinCallUseCase";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";

export class CanJoinCallUseCase implements ICanJoinCallUseCase {
    constructor(private _bookingRepository: IBookingRepository) { }

    async execute(bookingId: string, userId: string, role: 'user' | 'lawyer'): Promise<{ canJoin: boolean; message: string }> {
        const booking = await this._bookingRepository.findById(bookingId);

        if (!booking) {
            throw new NotFoundError("Booking not found");
        }


        if (role === 'user' && booking.userId.toString() !== userId) {
            return { canJoin: false, message: "Unauthorized: You are not a participant in this booking" };
        }
        if (role === 'lawyer' && booking.lawyerId.toString() !== userId) {
            return { canJoin: false, message: "Unauthorized: You are not the assigned lawyer for this booking" };
        }

        if (!['confirmed', 'follow-up'].includes(booking.status) || booking.paymentStatus !== 'paid') {
            return { canJoin: false, message: "Valid confirmed booking required" };
        }

        // Allow the call to start only 5 minutes before the scheduled time.
        const now = new Date();
        const start = this.parseTime(booking.date, booking.startTime);
        const end = this.parseTime(booking.date, booking.endTime);
        const callStartAllowed = new Date(start.getTime() - 5 * 60 * 1000);

        // if (now < callStartAllowed) {
        //     return { canJoin: false, message: "Call can be started only 5 minutes before the scheduled time" };
        // }

        if (now > end) {
            return { canJoin: false, message: "Consultation session has already ended" };
        }


        if (role === 'user' && !booking.lawyerJoined) {
            return { canJoin: false, message: "Please wait for the lawyer to join the call" };
        }

        return { canJoin: true, message: "You can join the call" };
    }

    private parseTime(dateStr: string, timeStr: string): Date {
        const date = new Date(dateStr);

        if (!timeStr) return date;

        const ampmMatch = timeStr.match(/\b(AM|PM)\b/i);
        const modifier = ampmMatch?.[1]?.toUpperCase();
        const timePart = timeStr.replace(/\b(AM|PM)\b/i, '').trim();
        const [hoursStr, minutesStr = '0'] = timePart.split(':');

        const hours = Number(hoursStr);
        const minutes = Number(minutesStr);

        if (Number.isNaN(hours) || Number.isNaN(minutes)) return date;

        if (modifier === 'PM' && hours < 12) {
            date.setHours(hours + 12, minutes, 0, 0);
            return date;
        }

        if (modifier === 'AM' && hours === 12) {
            date.setHours(0, minutes, 0, 0);
            return date;
        }

        
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
}

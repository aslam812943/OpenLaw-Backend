import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { ICanJoinCallUseCase } from "../../../interface/use-cases/common/ICanJoinCallUseCase";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";

export class CanJoinCallUseCase implements ICanJoinCallUseCase {
    constructor(private bookingRepository: IBookingRepository) { }

    async execute(bookingId: string, userId: string, role: 'user' | 'lawyer'): Promise<{ canJoin: boolean; message: string }> {
        const booking = await this.bookingRepository.findById(bookingId);

        if (!booking) {
            throw new NotFoundError("Booking not found");
        }


        if (role === 'user' && booking.userId.toString() !== userId) {
            return { canJoin: false, message: "Unauthorized: You are not a participant in this booking" };
        }
        if (role === 'lawyer' && booking.lawyerId.toString() !== userId) {
            return { canJoin: false, message: "Unauthorized: You are not the assigned lawyer for this booking" };
        }

        
        if (booking.status !== 'confirmed' || booking.paymentStatus !== 'paid') {
            return { canJoin: false, message: "Valid confirmed booking required" };
        }


        /*
        const now = new Date();
        const start = this.parseTime(booking.date, booking.startTime);
        const end = this.parseTime(booking.date, booking.endTime);

        if (now < start) {
            return { canJoin: false, message: "Consultation time has not started yet" };
        }

        if (now > end) {
            return { canJoin: false, message: "Consultation session has already ended" };
        }
        */


        if (role === 'user' && !booking.lawyerJoined) {
            return { canJoin: false, message: "Please wait for the lawyer to join the call" };
        }

        return { canJoin: true, message: "You can join the call" };
    }

    private parseTime(dateStr: string, timeStr: string): Date {

        const date = new Date(dateStr);
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        date.setHours(hours, minutes, 0, 0);
        return date;
    }
}

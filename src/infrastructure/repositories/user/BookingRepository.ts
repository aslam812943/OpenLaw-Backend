import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { Booking } from "../../../domain/entities/Booking";
import { BookingModel } from "../../db/models/BookingModel";
import { InternalServerError } from "../../errors/InternalServerError";
import { NotFoundError } from "../../errors/NotFoundError";

export class BookingRepository implements IBookingRepository {

    async create(booking: Booking): Promise<Booking> {
        try {

            const { id, ...bookingData } = booking;
            const newBooking = new BookingModel(bookingData);
            const savedBooking = await newBooking.save();

            return new Booking(
                savedBooking.id,
                savedBooking.userId,
                savedBooking.lawyerId,
                savedBooking.date,
                savedBooking.startTime,
                savedBooking.endTime,
                savedBooking.consultationFee,
                savedBooking.status as any,
                savedBooking.paymentStatus as any,
                savedBooking.paymentId,
                savedBooking.stripeSessionId,
                savedBooking.description,

            );
        } catch (error: any) {
            throw new InternalServerError("Database error while creating booking.");
        }
    }

    async findById(id: string): Promise<Booking | null> {
        try {
            const booking = await BookingModel.findById(id);
            if (!booking) return null;
            return new Booking(
                booking.id,
                booking.userId,
                booking.lawyerId,
                booking.date,
                booking.startTime,
                booking.endTime,
                booking.consultationFee,
                booking.status as any,
                booking.paymentStatus as any,
                booking.paymentId,
                booking.stripeSessionId,
                booking.description,

            );
        } catch (error: any) {
            throw new InternalServerError("Database error while fetching booking by ID.");
        }
    }

    async updateStatus(id: string, status: string, reason?: string): Promise<void> {
        try {
            const updateData: any = { status };
            if (reason) {
                updateData.cancellationReason = reason;
            }
            await BookingModel.findByIdAndUpdate(id, updateData);
        } catch (error: any) {
            throw new InternalServerError("Database error while updating booking status.");
        }
    }


    async findByUserId(userId: string): Promise<Booking[]> {
        try {
            const bookings = await BookingModel.find({ userId })
                .populate('lawyerId', 'name')
                .sort({ createdAt: -1 });
            return bookings.map(booking => new Booking(
                booking.id,
                booking.userId,
                booking.lawyerId,
                booking.date,
                booking.startTime,
                booking.endTime,
                booking.consultationFee,
                booking.status as any,
                booking.paymentStatus as any,
                booking.paymentId,
                booking.stripeSessionId,
                booking.description,
                undefined, 
                booking.cancellationReason,
                (booking.lawyerId as any)?.name
            ));
        } catch (error: any) {
            throw new InternalServerError("Database error while fetching user bookings.");
        }
    }
}

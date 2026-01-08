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
                undefined,
                savedBooking.cancellationReason,
                undefined,
                savedBooking.refundAmount,
                savedBooking.refundStatus as any,
                savedBooking.isCallActive,
                savedBooking.lawyerJoined,
                (savedBooking as any).createdAt
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
                undefined,
                booking.cancellationReason,
                undefined,
                booking.refundAmount,
                booking.refundStatus as any,
                booking.isCallActive,
                booking.lawyerJoined,
                (booking as any).createdAt
            );
        } catch (error: any) {
            throw new InternalServerError("Database error while fetching booking by ID.");
        }
    }

    async updateStatus(id: string, status: string, reason?: string, refundDetails?: { amount: number, status: 'full' | 'partial' }): Promise<void> {
        try {
            const updateData: any = { status };
            if (reason) {
                updateData.cancellationReason = reason;
            }
            if (refundDetails) {
                updateData.refundAmount = refundDetails.amount;
                updateData.refundStatus = refundDetails.status;
            }
            await BookingModel.findByIdAndUpdate(id, updateData);
        } catch (error: any) {
            throw new InternalServerError("Database error while updating booking status.");
        }
    }


    async findByUserId(userId: string, page: number = 1, limit: number = 10): Promise<{ bookings: Booking[], total: number }> {
        try {
            const skip = (page - 1) * limit;

            const [bookings, total] = await Promise.all([
                BookingModel.find({ userId })
                    .populate('lawyerId', 'name')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                BookingModel.countDocuments({ userId })
            ]);

            return {
                bookings: bookings.map(booking => new Booking(
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
                    (booking.lawyerId as any)?.name,
                    booking.refundAmount,
                    booking.refundStatus as any,
                    booking.isCallActive,
                    booking.lawyerJoined,
                    (booking as any).createdAt
                )),
                total
            };
        } catch (error: any) {
            throw new InternalServerError("Database error while fetching user bookings.");
        }
    }

    async existsByUserIdAndLawyerId(userId: string, lawyerId: string): Promise<boolean> {
        try {
            const count = await BookingModel.countDocuments({
                userId,
                lawyerId,
                status: { $in: ['confirmed', 'pending'] },
                paymentStatus: 'paid'
            });
            return count > 0;
        } catch (error: any) {
            throw new InternalServerError("Database error while checking booking existence.");
        }
    }

    async findActiveBooking(userId: string, lawyerId: string): Promise<Booking | null> {
        try {
            // Priority 1: Confirmed and Paid
            let booking = await BookingModel.findOne({
                userId,
                lawyerId,
                status: 'confirmed',
                paymentStatus: 'paid'
            }).sort({ createdAt: -1 });

            // Priority 2: Pending and Paid
            if (!booking) {
                booking = await BookingModel.findOne({
                    userId,
                    lawyerId,
                    status: 'pending',
                    paymentStatus: 'paid'
                }).sort({ createdAt: -1 });
            }

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
                booking.description
            );
        } catch (error: any) {
            throw new InternalServerError("Database error while fetching active booking.");
        }
    }

    async findByStripeSessionId(sessionId: string): Promise<Booking | null> {
        try {
            const booking = await BookingModel.findOne({ stripeSessionId: sessionId });
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
                booking.description
            );
        } catch (error: any) {
            throw new InternalServerError("Database error while fetching booking by session ID.");
        }
    }
    async findByLawyerId(lawyerId: string): Promise<Booking[]> {
        try {
            const bookings = await BookingModel.find({ lawyerId })
                .populate('userId', 'name')
                .sort({ createdAt: -1 });

            return bookings.map(booking => new Booking(
                booking.id,
                (booking.userId as any)._id.toString(),
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
                (booking.userId as any)?.name,
                undefined,
                undefined,
                undefined,
                undefined,
                booking.isCallActive,
                booking.lawyerJoined,
                (booking as any).createdAt
            ));
        } catch (error: any) {
            throw new InternalServerError("Database error while fetching lawyer bookings.");
        }
    }

    async updateCallStatus(id: string, lawyerJoined: boolean, isCallActive?: boolean): Promise<void> {
        try {
            const updateData: any = { lawyerJoined };
            if (isCallActive !== undefined) {
                updateData.isCallActive = isCallActive;
            }
            await BookingModel.findByIdAndUpdate(id, updateData);
        } catch (error: any) {
            throw new InternalServerError("Database error while updating call status.");
        }
    }
}

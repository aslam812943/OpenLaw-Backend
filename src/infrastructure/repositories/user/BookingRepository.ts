import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { Booking } from "../../../domain/entities/Booking";
import { BookingModel, IBookingDocument } from "../../db/models/BookingModel";
import { InternalServerError } from "../../errors/InternalServerError";
import mongoose, { Types } from "mongoose";

export class BookingRepository implements IBookingRepository {

    private mapToEntity(doc: IBookingDocument): Booking {
        const docObj = doc.toObject() as {
            userId?: { _id: Types.ObjectId, name: string },
            lawyerId?: { _id: Types.ObjectId, name: string },
            createdAt?: Date
        };

        return new Booking(
            doc.id,
            docObj.userId?._id?.toString() || doc.userId?.toString() || "",
            docObj.lawyerId?._id?.toString() || doc.lawyerId?.toString() || "",
            doc.date,
            doc.startTime,
            doc.endTime,
            doc.consultationFee,
            doc.status as 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected',
            doc.paymentStatus as 'pending' | 'paid' | 'failed',
            doc.paymentId,
            doc.stripeSessionId,
            doc.description,
            docObj.userId?.name,
            doc.cancellationReason,
            docObj.lawyerId?.name,
            doc.refundAmount,
            doc.refundStatus as 'none' | 'full' | 'partial',
            doc.isCallActive,
            doc.lawyerJoined,
            doc.commissionPercent || 0,
            doc.lawyerFeedback,
            docObj.createdAt
        );
    }

    async create(booking: Booking): Promise<Booking> {
        try {
            const { id, ...bookingData } = booking;
            const newBooking = new BookingModel(bookingData);
            const savedBooking = await newBooking.save();

            return this.mapToEntity(savedBooking);
        } catch (error: unknown) {
            throw new InternalServerError("Database error while creating booking.");
        }
    }

    async findById(id: string): Promise<Booking | null> {
        try {
            const booking = await BookingModel.findById(id);
            if (!booking) return null;
            return this.mapToEntity(booking);
        } catch (error: unknown) {
            throw new InternalServerError("Database error while fetching booking by ID.");
        }
    }

    async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected', reason?: string, refundDetails?: { amount: number, status: 'full' | 'partial' }, lawyerFeedback?: string): Promise<void> {
        try {
            const updateData: Partial<IBookingDocument> = { status };
            if (reason) {
                updateData.cancellationReason = reason;
            }
            if (refundDetails) {
                updateData.refundAmount = refundDetails.amount;
                updateData.refundStatus = refundDetails.status;
            }
            if (lawyerFeedback) {
                updateData.lawyerFeedback = lawyerFeedback;
            }
            await BookingModel.findByIdAndUpdate(id, updateData);
        } catch (error: unknown) {
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
                bookings: bookings.map(booking => this.mapToEntity(booking)),
                total
            };
        } catch (error: unknown) {
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
        } catch (error: unknown) {
            throw new InternalServerError("Database error while checking booking existence.");
        }
    }

    async findActiveBooking(userId: string, lawyerId: string): Promise<Booking | null> {
        try {
            let booking = await BookingModel.findOne({
                userId,
                lawyerId,
                status: 'confirmed',
                paymentStatus: 'paid'
            }).sort({ createdAt: -1 });

            if (!booking) {
                booking = await BookingModel.findOne({
                    userId,
                    lawyerId,
                    status: 'pending',
                    paymentStatus: 'paid'
                }).sort({ createdAt: -1 });
            }

            if (!booking) {
                booking = await BookingModel.findOne({
                    userId,
                    lawyerId,
                    status: 'completed'
                }).sort({ createdAt: -1 });
            }

            if (!booking) return null;

            return this.mapToEntity(booking);
        } catch (error: unknown) {
            throw new InternalServerError("Database error while fetching active booking.");
        }
    }

    async findByStripeSessionId(sessionId: string): Promise<Booking | null> {
        try {
            const booking = await BookingModel.findOne({ stripeSessionId: sessionId });
            if (!booking) return null;

            return this.mapToEntity(booking);
        } catch (error: unknown) {
            throw new InternalServerError("Database error while fetching booking by session ID.");
        }
    }
    async findByLawyerId(lawyerId: string): Promise<Booking[]> {
        try {
            const bookings = await BookingModel.find({ lawyerId })
                .populate('userId', 'name')
                .sort({ createdAt: -1 });

            return bookings.map(booking => this.mapToEntity(booking));
        } catch (error: unknown) {
            throw new InternalServerError("Database error while fetching lawyer bookings.");
        }
    }

    async updateCallStatus(id: string, lawyerJoined: boolean, isCallActive?: boolean): Promise<void> {
        try {
            const updateData: Partial<IBookingDocument> = { lawyerJoined };
            if (isCallActive !== undefined) {
                updateData.isCallActive = isCallActive;
            }
            await BookingModel.findByIdAndUpdate(id, updateData);
        } catch (error: unknown) {
            throw new InternalServerError("Database error while updating call status.");
        }
    }

    async findAll(page: number = 1, limit: number = 10, status?: string): Promise<{ bookings: Booking[], total: number }> {
        try {
            const skip = (page - 1) * limit;
            const query: mongoose.FilterQuery<IBookingDocument> = {};
            if (status) {
                query.status = status;
            }

            const [bookings, total] = await Promise.all([
                BookingModel.find(query)
                    .populate('userId', 'name')
                    .populate('lawyerId', 'name')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                BookingModel.countDocuments(query)
            ]);

            return {
                bookings: bookings.map(booking => this.mapToEntity(booking)),
                total
            };
        } catch (error: unknown) {
            throw new InternalServerError("Database error while fetching all bookings.");
        }
    }
}

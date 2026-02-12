import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { Booking } from "../../../domain/entities/Booking";
import { BookingModel, IBookingDocument } from "../../db/models/BookingModel";
import { InternalServerError } from "../../errors/InternalServerError";
import { MessageConstants } from "../../constants/MessageConstants";
import mongoose, { Types } from "mongoose";
import LawyerModel from "../../db/models/LawyerModel";
import UserModel from "../../db/models/UserModel";

import { BaseRepository } from "../BaseRepository";

export class BookingRepository extends BaseRepository<IBookingDocument> implements IBookingRepository {
    constructor() {
        super(BookingModel);
    }

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
            doc.bookingId,
            docObj.createdAt,
            doc.followUpType as 'none' | 'specific' | 'deadline',
            doc.followUpDate,
            doc.followUpTime,
            doc.followUpStatus as 'none' | 'pending' | 'booked',
            doc.parentBookingId?.toString()
        );
    }

    async create(booking: Booking): Promise<Booking> {
        try {
            const { id, ...bookingData } = booking;

            const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
            const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
            bookingData.bookingId = `BK-${dateStr}-${randomStr}`;

            const newBooking = new BookingModel(bookingData);
            const savedBooking = await newBooking.save();

            return this.mapToEntity(savedBooking);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
        }
    }

    async findById(id: string): Promise<Booking | null> {
        try {
            const booking = await BookingModel.findById(id);
            if (!booking) return null;
            return this.mapToEntity(booking);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_BY_ID_ERROR);
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
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }


    async findByUserId(userId: string, page: number = 1, limit: number = 10, status?: string, search?: string, date?: string): Promise<{ bookings: Booking[], total: number }> {
        try {
            const p = Number(page) || 1;
            const l = Number(limit) || 10;
            const skip = (p - 1) * l;
            const query: mongoose.FilterQuery<IBookingDocument> = { userId: new Types.ObjectId(userId) };

        

            if (status && typeof status === 'string' && status.trim() !== "" && status !== "undefined" && status !== "null") {
                const statuses = status.split(",").map(s => s.trim());
                query.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
            }
            if (date && typeof date === 'string' && date.trim() !== "" && date !== "undefined" && date !== "null") {
                query.date = date.trim();
            }

            if (search && typeof search === 'string' && search.trim() !== "" && search !== "undefined" && search !== "null") {
                const searchStr = search.trim();
                const lawyers = await LawyerModel.find({ name: { $regex: searchStr, $options: 'i' } }).select('_id');

                query.$or = [
                    { lawyerId: { $in: lawyers.map(l => l._id) } },
                    { bookingId: { $regex: searchStr, $options: 'i' } }
                ];
            }

            const [bookings, total] = await Promise.all([
                BookingModel.find(query)
                    .populate('lawyerId', 'name')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(l),
                BookingModel.countDocuments(query)
            ]);

            return {
                bookings: bookings.map(booking => this.mapToEntity(booking)),
                total
            };
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
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
            throw new InternalServerError(MessageConstants.REPOSITORY.EXISTS_ERROR);
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
            throw new InternalServerError(MessageConstants.REPOSITORY.ACTIVE_FETCH_ERROR);
        }
    }

    async findByStripeSessionId(sessionId: string): Promise<Booking | null> {
        try {
            const booking = await BookingModel.findOne({ stripeSessionId: sessionId });
            if (!booking) return null;

            return this.mapToEntity(booking);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.SESSION_FETCH_ERROR);
        }
    }
    async findByLawyerId(lawyerId: string, page: number = 1, limit: number = 10, status?: string, search?: string, date?: string): Promise<{ bookings: Booking[], total: number }> {
        try {
            const p = Number(page) || 1;
            const l = Number(limit) || 10;
            const skip = (p - 1) * l;
            const query: mongoose.FilterQuery<IBookingDocument> = { lawyerId: new Types.ObjectId(lawyerId) };

           
            if (status && typeof status === 'string' && status.trim() !== "" && status !== "undefined" && status !== "null") {
                const statuses = status.split(",").map(s => s.trim());
                query.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
            }
            if (date && typeof date === 'string' && date.trim() !== "" && date !== "undefined" && date !== "null") {
                query.date = date.trim();
            }

            if (search && typeof search === 'string' && search.trim() !== "" && search !== "undefined" && search !== "null") {
                const searchStr = search.trim();
                const users = await UserModel.find({ name: { $regex: searchStr, $options: 'i' } }).select('_id');
                query.$or = [
                    { userId: { $in: users.map(u => u._id) } },
                    { bookingId: { $regex: searchStr, $options: 'i' } }
                ];
            }

            const [bookings, total] = await Promise.all([
                BookingModel.find(query)
                    .populate('userId', 'name')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(l),
                BookingModel.countDocuments(query)
            ]);

            return {
                bookings: bookings.map(booking => this.mapToEntity(booking)),
                total
            };
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
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
            throw new InternalServerError(MessageConstants.REPOSITORY.CALL_STATUS_UPDATE_ERROR);
        }
    }

    async findAll(page: number = 1, limit: number = 10, status?: string, search?: string, date?: string): Promise<{ bookings: Booking[], total: number }> {
        try {
            const p = Number(page) || 1;
            const l = Number(limit) || 10;
            const skip = (p - 1) * l;
            const query: mongoose.FilterQuery<IBookingDocument> = {};

         

            if (status && typeof status === 'string' && status.trim() !== "" && status !== "undefined" && status !== "null") {
                const statuses = status.split(",").map(s => s.trim());
                query.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
            }
            if (date && typeof date === 'string' && date.trim() !== "" && date !== "undefined" && date !== "null") {
                query.date = date.trim();
            }

            if (search && typeof search === 'string' && search.trim() !== "" && search !== "undefined" && search !== "null") {
                const searchStr = search.trim();
                const [userIds, lawyerIds] = await Promise.all([
                    UserModel.find({ name: { $regex: searchStr, $options: 'i' } }).select('_id'),
                    LawyerModel.find({ name: { $regex: searchStr, $options: 'i' } }).select('_id')
                ]);
                query.$or = [
                    { userId: { $in: userIds.map(u => u._id) } },
                    { lawyerId: { $in: lawyerIds.map(l => l._id) } },
                    { bookingId: { $regex: searchStr, $options: 'i' } }
                ];
            }

            const [bookings, total] = await Promise.all([
                BookingModel.find(query)
                    .populate('userId', 'name')
                    .populate('lawyerId', 'name')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(l),
                BookingModel.countDocuments(query)
            ]);

            return {
                bookings: bookings.map(booking => this.mapToEntity(booking)),
                total
            };
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
        }
    }

    async getEarningsStats(lawyerId: string): Promise<{ totalGross: number, pendingNet: number }> {
        try {
            const stats = await BookingModel.aggregate([
                { $match: { lawyerId: new Types.ObjectId(lawyerId), paymentStatus: 'paid' } },
                {
                    $group: {
                        _id: null,
                        totalGross: {
                            $sum: {
                                $cond: [
                                    { $in: ["$status", ["confirmed", "completed"]] },
                                    "$consultationFee",
                                    0
                                ]
                            }
                        },
                        pendingNet: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "confirmed"] },
                                    {
                                        $subtract: [
                                            "$consultationFee",
                                            { $multiply: ["$consultationFee", { $divide: [{ $ifNull: ["$commissionPercent", 0] }, 100] }] }
                                        ]
                                    },
                                    0
                                ]
                            }
                        }
                    }
                }
            ]);

            if (stats.length === 0) {
                return { totalGross: 0, pendingNet: 0 };
            }

            return {
                totalGross: stats[0].totalGross || 0,
                pendingNet: stats[0].pendingNet || 0
            };
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.EARNINGS_STATS_ERROR);
        }
    }

    async setFollowUpDetails(id: string, followUpType: 'none' | 'specific' | 'deadline', followUpDate?: string, followUpTime?: string, lawyerFeedback?: string): Promise<void> {
        try {
            await BookingModel.findByIdAndUpdate(id, {
                followUpType,
                followUpDate,
                followUpTime,
                followUpStatus: 'pending',
                status: 'follow-up',
                lawyerFeedback
            });
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }

    async findFollowUpByParentId(parentId: string): Promise<Booking | null> {
        try {
            const booking = await BookingModel.findOne({ parentBookingId: new Types.ObjectId(parentId) });
            if (!booking) return null;
            return this.mapToEntity(booking);
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.FIND_ERROR);
        }
    }

    async updateFollowUpStatus(id: string, status: 'none' | 'pending' | 'booked'): Promise<void> {
        try {
            await BookingModel.findByIdAndUpdate(id, { followUpStatus: status });
        } catch (error: unknown) {
            throw new InternalServerError(MessageConstants.REPOSITORY.UPDATE_ERROR);
        }
    }
}

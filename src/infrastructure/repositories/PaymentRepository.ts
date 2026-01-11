import { IPaymentRepository } from "../../domain/repositories/IPaymentRepository";
import { Payment } from "../../domain/entities/Payment";
import { PaymentModel, IPaymentDocument } from "../db/models/admin/PaymentModel";
import { BookingModel } from "../db/models/BookingModel";
import { WithdrawalModel } from "../db/models/admin/WithdrawalModel";
import mongoose from "mongoose";

export class PaymentRepository implements IPaymentRepository {
    async create(payment: Partial<Payment>): Promise<Payment> {
        const newPayment = await PaymentModel.create(payment);
        return this.mapToEntity(newPayment);
    }

    async findById(id: string): Promise<Payment | null> {
        const payment = await PaymentModel.findById(id);
        return payment ? this.mapToEntity(payment) : null;
    }

    async findByBookingId(bookingId: string): Promise<Payment | null> {
        const payment = await PaymentModel.findOne({ bookingId });
        return payment ? this.mapToEntity(payment) : null;
    }

    async findByTransactionId(transactionId: string): Promise<Payment | null> {
        const payment = await PaymentModel.findOne({ transactionId });
        return payment ? this.mapToEntity(payment) : null;
    }

    async findAll(filters?: any): Promise<{ payments: Payment[]; total: number }> {
        const query: any = {};

        if (filters?.search) {
            query.$or = [
                { transactionId: { $regex: filters.search, $options: 'i' } }
            ];
        }

        if (filters?.status && filters.status !== 'all') {
            query.status = filters.status;
        }

        if (filters?.type && filters.type !== 'all') {
            query.type = filters.type;
        }

        if (filters?.startDate && filters?.endDate) {
            query.createdAt = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate)
            };
        }

        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        const [payments, total] = await Promise.all([
            PaymentModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('lawyerId', 'name')
                .populate('userId', 'name'),
            PaymentModel.countDocuments(query)
        ]);

        return {
            payments: payments.map(p => this.mapToEntity(p)),
            total
        };
    }

    async getDashboardStats(startDate?: Date, endDate?: Date): Promise<any> {
        const now = new Date();

        const dateFilter: any = {};
        if (startDate || endDate) {
            const range: any = {};
            if (startDate) range.$gte = startDate;
            if (endDate) range.$lte = endDate;
            dateFilter.createdAt = range;
        }

        const [revenueStats, bookingStats, withdrawalStats, topLawyers, monthlyRevenue] = await Promise.all([

            BookingModel.aggregate([
                { $match: { paymentStatus: 'paid', ...dateFilter } },
                {
                    $lookup: {
                        from: 'lawyers',
                        localField: 'lawyerId',
                        foreignField: '_id',
                        as: 'lawyer'
                    }
                },
                { $unwind: '$lawyer' },
                {
                    $lookup: {
                        from: 'subscriptions',
                        localField: 'lawyer.subscriptionId',
                        foreignField: '_id',
                        as: 'subscription'
                    }
                },
                { $unwind: { path: '$subscription', preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$consultationFee' },
                        totalCommission: {
                            $sum: {
                                $multiply: [
                                    '$consultationFee',
                                    { $divide: [{ $ifNull: ['$subscription.commissionPercent', 0] }, 100] }
                                ]
                            }
                        }
                    }
                }
            ]),

            // Booking Stats
            BookingModel.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Withdrawal Stats
            WithdrawalModel.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: null,
                        totalWithdrawn: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0]
                            }
                        },
                        pendingWithdrawals: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0]
                            }
                        }
                    }
                }
            ]),

            // Top Performing Lawyers
            BookingModel.aggregate([
                { $match: { paymentStatus: 'paid', ...dateFilter } },
                {
                    $group: {
                        _id: '$lawyerId',
                        revenue: { $sum: '$consultationFee' },
                        bookings: { $sum: 1 }
                    }
                },
                { $sort: { revenue: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'lawyers',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'lawyer'
                    }
                },
                { $unwind: '$lawyer' },
                {
                    $project: {
                        name: '$lawyer.name',
                        revenue: 1,
                        bookings: 1
                    }
                }
            ]),


            BookingModel.aggregate([
                {
                    $match: {
                        paymentStatus: 'paid',
                        createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                            year: { $year: '$createdAt' }
                        },
                        revenue: { $sum: '$consultationFee' }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])
        ]);

        // Format Booking Stats
        const formattedBookingStats = {
            completed: 0,
            cancelled: 0,
            pending: 0,
            rejected: 0,
            confirmed: 0
        };
        bookingStats.forEach((stat: any) => {
            if (stat._id in formattedBookingStats) {
                formattedBookingStats[stat._id as keyof typeof formattedBookingStats] = stat.count;
            }
        });

        // Format Monthly Revenue
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedMonthlyRevenue = monthlyRevenue.map((m: any) => ({
            month: monthNames[m._id.month - 1],
            revenue: m.revenue
        }));

        return {
            totalRevenue: revenueStats[0]?.totalRevenue || 0,
            totalCommission: revenueStats[0]?.totalCommission || 0,
            bookingStats: formattedBookingStats,
            withdrawalStats: {
                totalWithdrawn: withdrawalStats[0]?.totalWithdrawn || 0,
                pendingWithdrawals: withdrawalStats[0]?.pendingWithdrawals || 0
            },
            topLawyers: topLawyers,
            monthlyRevenue: formattedMonthlyRevenue
        };
    }

    async getLawyerDashboardStats(lawyerId: string, startDate?: Date, endDate?: Date): Promise<any> {
        const dateFilter: any = {};
        if (startDate || endDate) {
            const range: any = {};
            if (startDate) range.$gte = startDate;
            if (endDate) range.$lte = endDate;
            dateFilter.createdAt = range;
        }

        const lawyerObjectId = new mongoose.Types.ObjectId(lawyerId);

        const [revenueStats, bookingStats, monthlyEarnings] = await Promise.all([

            BookingModel.aggregate([
                {
                    $match: {
                        lawyerId: lawyerObjectId,
                        paymentStatus: 'paid',
                        status: { $in: ['confirmed', 'completed'] },
                        ...dateFilter
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalEarnings: { $sum: '$consultationFee' },
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Booking Breakdown
            BookingModel.aggregate([
                { $match: { lawyerId: lawyerObjectId, ...dateFilter } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Monthly Earnings Trend
            BookingModel.aggregate([
                {
                    $match: {
                        lawyerId: lawyerObjectId,
                        paymentStatus: 'paid',
                        status: { $in: ['confirmed', 'completed'] },
                        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1) }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                            year: { $year: '$createdAt' }
                        },
                        earnings: { $sum: '$consultationFee' }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])
        ]);

        const formattedBookingStats = {
            completed: 0,
            cancelled: 0,
            pending: 0,
            rejected: 0,
            confirmed: 0
        };
        bookingStats.forEach((stat: any) => {
            if (stat._id in formattedBookingStats) {
                formattedBookingStats[stat._id as keyof typeof formattedBookingStats] = stat.count;
            }
        });

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedMonthlyEarnings = monthlyEarnings.map((m: any) => ({
            month: monthNames[m._id.month - 1],
            earnings: m.earnings
        }));

        return {
            totalEarnings: revenueStats[0]?.totalEarnings || 0,
            totalConsultations: revenueStats[0]?.count || 0,
            bookingStats: formattedBookingStats,
            monthlyEarnings: formattedMonthlyEarnings
        };
    }

    private mapToEntity(doc: IPaymentDocument): Payment {
        return new Payment(
            doc._id as string,
            doc.userId ? (typeof doc.userId === 'object' && 'name' in doc.userId ? (doc.userId as any)._id.toString() : String(doc.userId)) : '',
            typeof doc.lawyerId === 'object' && 'name' in doc.lawyerId ? (doc.lawyerId as any)._id.toString() : String(doc.lawyerId),
            doc.amount,
            doc.currency,
            doc.status as 'pending' | 'completed' | 'failed' | 'refunded',
            doc.transactionId,
            doc.paymentMethod,
            (doc as any).createdAt,
            (doc as any).updatedAt,
            doc.bookingId ? String(doc.bookingId) : undefined,
            doc.subscriptionId ? String(doc.subscriptionId) : undefined,
            doc.type as 'booking' | 'subscription' | undefined,
            typeof doc.lawyerId === 'object' && 'name' in doc.lawyerId ? (doc.lawyerId as any).name : undefined,
            doc.userId && typeof doc.userId === 'object' && 'name' in doc.userId ? (doc.userId as any).name : undefined
        );
    }
}

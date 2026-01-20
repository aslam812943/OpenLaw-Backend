import { Payment } from "../entities/Payment";

export interface IDashboardStats {
    totalRevenue: number;
    totalCommission: number;
    bookingStats: {
        completed: number;
        cancelled: number;
        pending: number;
        rejected: number;
        confirmed: number;
    };
    withdrawalStats: {
        totalWithdrawn: number;
        pendingWithdrawals: number;
    };
    topLawyers: Array<{
        name: string;
        revenue: number;
        bookings: number;
    }>;
    monthlyRevenue: Array<{
        month: string;
        revenue: number;
    }>;
}

export interface ILawyerDashboardStats {
    totalEarnings: number;
    totalConsultations: number;
    bookingStats: {
        completed: number;
        cancelled: number;
        pending: number;
        rejected: number;
        confirmed: number;
    };
    monthlyEarnings: Array<{
        month: string;
        earnings: number;
    }>;
}

export interface IPaymentRepository {
    create(payment: Partial<Payment>): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByBookingId(bookingId: string): Promise<Payment | null>;
    findByTransactionId(transactionId: string): Promise<Payment | null>;
    findAll(filters?: { search?: string; status?: string; type?: string; startDate?: Date; endDate?: Date; page?: number; limit?: number }): Promise<{ payments: Payment[]; total: number }>;
    getDashboardStats(startDate?: Date, endDate?: Date): Promise<IDashboardStats>;
    getLawyerDashboardStats(lawyerId: string, startDate?: Date, endDate?: Date): Promise<ILawyerDashboardStats>;
}


export interface DashboardStatsDTO {
    totalRevenue: number;
    totalCommission: number;
    topLawyers: { name: string; revenue: number; bookings: number }[];
    monthlyRevenue: { month: string; revenue: number }[];
    bookingStats: {
        completed: number;
        cancelled: number;
        pending: number;
        rejected: number;
    };
    withdrawalStats: {
        totalWithdrawn: number;
        pendingWithdrawals: number;
    };
}

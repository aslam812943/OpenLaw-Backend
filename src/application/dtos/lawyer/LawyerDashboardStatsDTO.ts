export interface LawyerDashboardStatsDTO {
    totalEarnings: number;
    totalConsultations: number;
    bookingStats: {
        completed: number;
        cancelled: number;
        pending: number;
        rejected: number;
        confirmed: number;
    };
    monthlyEarnings: { month: string; earnings: number }[];
}

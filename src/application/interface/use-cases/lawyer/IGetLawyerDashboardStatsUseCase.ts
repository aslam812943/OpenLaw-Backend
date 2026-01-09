import { LawyerDashboardStatsDTO } from "../../../dtos/lawyer/LawyerDashboardStatsDTO";

export interface IGetLawyerDashboardStatsUseCase {
    execute(lawyerId: string, startDate?: Date, endDate?: Date): Promise<LawyerDashboardStatsDTO>;
}

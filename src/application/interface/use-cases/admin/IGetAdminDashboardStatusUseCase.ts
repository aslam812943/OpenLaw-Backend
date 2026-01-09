import { DashboardStatsDTO } from "../../../dtos/admin/DashboardStatsDTO"

export interface IGetAdminDashboardStatsUseCase{
    execute():Promise<DashboardStatsDTO>
}
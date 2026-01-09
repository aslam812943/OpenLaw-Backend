import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { DashboardStatsDTO } from "../../dtos/admin/DashboardStatsDTO";
import { IGetAdminDashboardStatsUseCase } from "../../interface/use-cases/admin/IGetAdminDashboardStatusUseCase";
export class GetAdminDashboardStatsUseCase implements IGetAdminDashboardStatsUseCase {
    constructor(private _paymentRepository: IPaymentRepository) { }

    async execute(): Promise<DashboardStatsDTO> {
        return await this._paymentRepository.getDashboardStats();
    }
}

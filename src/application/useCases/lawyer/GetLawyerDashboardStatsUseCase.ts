import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { LawyerDashboardStatsDTO } from "../../dtos/lawyer/LawyerDashboardStatsDTO";
import { IGetLawyerDashboardStatsUseCase } from "../../interface/use-cases/lawyer/IGetLawyerDashboardStatsUseCase";

export class GetLawyerDashboardStatsUseCase implements IGetLawyerDashboardStatsUseCase {
    constructor(private _paymentRepository: IPaymentRepository) { }

    async execute(lawyerId: string, startDate?: Date, endDate?: Date): Promise<LawyerDashboardStatsDTO> {
        return await this._paymentRepository.getLawyerDashboardStats(lawyerId, startDate, endDate);
    }
}

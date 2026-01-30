import { Request, Response, NextFunction } from "express";
import { IGetLawyerDashboardStatsUseCase } from "../../../application/interface/use-cases/lawyer/IGetLawyerDashboardStatsUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class LawyerDashboardController {
    constructor(private readonly _getLawyerDashboardStatsUseCase: IGetLawyerDashboardStatsUseCase) { }

    async getStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const lawyerId = req.user?.id;
            if (!lawyerId) {
                return ApiResponse.error(res, HttpStatusCode.FORBIDDEN, MessageConstants.COMMON.UNAUTHORIZED);
                return;
            }

            const { startDate, endDate } = req.query;
            let start: Date | undefined;
            let end: Date | undefined;

            if (startDate) {
                start = new Date(startDate as string);
                if (isNaN(start.getTime())) start = undefined;
            }
            if (endDate) {
                end = new Date(endDate as string);
                if (isNaN(end.getTime())) end = undefined;
            }

            const stats = await this._getLawyerDashboardStatsUseCase.execute(lawyerId, start, end);

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.DASHBOARD.STATS_FETCH_SUCCESS, stats);
        } catch (error: unknown) {
            next(error);
        }
    }
}

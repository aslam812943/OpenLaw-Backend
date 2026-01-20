import { Request, Response, NextFunction } from "express";
import { IGetAdminDashboardStatsUseCase } from "../../../application/interface/use-cases/admin/IGetAdminDashboardStatsUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class AdminDashboardController {
    constructor(private readonly _getAdminDashboardStatsUseCase: IGetAdminDashboardStatsUseCase) { }

    async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
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

            const stats = await this._getAdminDashboardStatsUseCase.execute(start, end);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.DASHBOARD.STATS_FETCH_SUCCESS,
                data: stats
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}

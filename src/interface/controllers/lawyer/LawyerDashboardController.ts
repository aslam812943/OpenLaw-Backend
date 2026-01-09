import { Request, Response, NextFunction } from "express";
import { IGetLawyerDashboardStatsUseCase } from "../../../application/interface/use-cases/lawyer/IGetLawyerDashboardStatsUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class LawyerDashboardController {
    constructor(private _getLawyerDashboardStatsUseCase: IGetLawyerDashboardStatsUseCase) { }

    async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const lawyerId = (req as any).user?.id; 
            if (!lawyerId) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
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
            res.status(HttpStatusCode.OK).json(stats);
        } catch (error) {
            next(error);
        }
    }
}

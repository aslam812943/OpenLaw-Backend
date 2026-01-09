import { Request, Response, NextFunction } from "express";
import { IGetAdminDashboardStatsUseCase } from "../../../application/interface/use-cases/admin/IGetAdminDashboardStatusUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
export class AdminDashboardController {
    constructor(private _getAdminDashboardStatsUseCase: IGetAdminDashboardStatsUseCase) { }

    async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await this._getAdminDashboardStatsUseCase.execute();
            res.status(HttpStatusCode.OK).json(stats);
        } catch (error) {
            next(error);
        }
    }
}

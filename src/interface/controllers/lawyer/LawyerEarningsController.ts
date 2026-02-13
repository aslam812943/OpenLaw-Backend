import { Request, Response, NextFunction } from "express";
import { IGetLawyerEarningsUseCase } from "../../../application/interface/use-cases/lawyer/IGetLawyerEarningsUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class LawyerEarningsController {
    constructor(private readonly _getLawyerEarningsUseCase: IGetLawyerEarningsUseCase) { }

    async getEarnings(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const lawyerId = req.user?.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const earnings = await this._getLawyerEarningsUseCase.execute(lawyerId!, page, limit);

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.EARNINGS_FETCH_SUCCESS, earnings);
        } catch (error: unknown) {
            next(error);
        }
    }
}

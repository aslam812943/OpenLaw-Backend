import { Request, Response, NextFunction } from "express";
import { IGetLawyerEarningsUseCase } from "../../../application/interface/use-cases/lawyer/IGetLawyerEarningsUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class LawyerEarningsController {
    constructor(private readonly _getLawyerEarningsUseCase: IGetLawyerEarningsUseCase) { }

    async getEarnings(req: Request, res: Response, next: NextFunction) {
        try {
            const lawyerId = req.user?.id;

            const earnings = await this._getLawyerEarningsUseCase.execute(lawyerId!);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.LAWYER.EARNINGS_FETCH_SUCCESS,
                data: earnings
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}

import { Request, Response, NextFunction } from "express";
import { IGetLawyerEarningsUseCase } from "../../../application/interface/use-cases/lawyer/IGetLawyerEarningsUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class LawyerEarningsController {
    constructor(private getLawyerEarningsUseCase: IGetLawyerEarningsUseCase) { }

    async getEarnings(req: Request, res: Response, next: NextFunction) {
        try {
            const lawyerId = (req as any).user.id;

            const earnings = await this.getLawyerEarningsUseCase.execute(lawyerId);

            res.status(HttpStatusCode.OK).json({
                success: true,
                data: earnings,
                message: "Earnings fetched successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}

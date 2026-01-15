import { Request, Response, NextFunction } from "express";
import { IGetLawyerCasesUseCase } from "../../../application/interface/use-cases/lawyer/IGetLawyerCasesUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class LawyerCasesController {
    constructor(private readonly _getLawyerCasesUseCase: IGetLawyerCasesUseCase) { }

    async getCases(req: Request, res: Response, next: NextFunction) {
        try {
            const lawyerId = req.user?.id;

            const cases = await this._getLawyerCasesUseCase.execute(lawyerId!);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.LAWYER.CASES_FETCH_SUCCESS,
                data: cases
            });
        } catch (error) {
            next(error);
        }
    }
}

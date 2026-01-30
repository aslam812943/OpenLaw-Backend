import { Request, Response, NextFunction } from "express";
import { IGetLawyerCasesUseCase } from "../../../application/interface/use-cases/lawyer/IGetLawyerCasesUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class LawyerCasesController {
    constructor(private readonly _getLawyerCasesUseCase: IGetLawyerCasesUseCase) { }

    async getCases(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const lawyerId = req.user?.id;

            const cases = await this._getLawyerCasesUseCase.execute(lawyerId!);

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.CASES_FETCH_SUCCESS, cases);
        } catch (error: unknown) {
            next(error);
        }
    }
}

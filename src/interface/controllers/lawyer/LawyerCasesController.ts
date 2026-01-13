import { Request, Response, NextFunction } from "express";
import { IGetLawyerCasesUseCase } from "../../../application/interface/use-cases/lawyer/IGetLawyerCasesUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class LawyerCasesController {
    constructor(private _getLawyerCasesUseCase: IGetLawyerCasesUseCase) { }

    async getCases(req: Request, res: Response, next: NextFunction) {
        try {
         
            const lawyerId = req.user?.id;

            const cases = await this._getLawyerCasesUseCase.execute(lawyerId!);
           
            res.status(HttpStatusCode.OK).json({ data: cases, message: "Cases fetched successfully" });
        } catch (error) {
            next(error);
        }
    }
}

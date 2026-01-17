import { NextFunction, Request, Response } from "express";
import { IGetActiveSpecializationsUseCase } from "../../../application/interface/use-cases/lawyer/specialization/IGetActiveSpecializationsUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class SpecializationController {
    constructor(private _getActiveSpecializationsUseCase: IGetActiveSpecializationsUseCase) { }

    async getSpecializations(_req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._getActiveSpecializationsUseCase.execute();
            res.status(HttpStatusCode.OK).json({ success: true, message: MessageConstants.SPECIALIZATION.FETCH_SUCCESS, data: result });
        } catch (error) {
            next(error);
        }
    }
}

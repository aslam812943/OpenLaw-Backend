import { NextFunction, Request, Response } from "express";
import { IGetActiveSpecializationsUseCase } from "../../../application/interface/use-cases/lawyer/specialization/IGetActiveSpecializationsUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class SpecializationController {
    constructor(private _getActiveSpecializationsUseCase: IGetActiveSpecializationsUseCase) { }

    async getSpecializations(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const result = await this._getActiveSpecializationsUseCase.execute();
            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.SPECIALIZATION.FETCH_SUCCESS, result);
        } catch (error: unknown) {
            next(error);
        }
    }
}

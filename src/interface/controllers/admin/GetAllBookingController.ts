import { IGetAllBookingUseCase } from "../../../application/interface/use-cases/admin/IGetAllBookingUseCase";
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";


export class GetAllBookingController {
    constructor(private _getallbookingusecase: IGetAllBookingUseCase) { }

    async execute(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string;
            const search = req.query.search as string;
            const date = req.query.date as string;

            const result = await this._getallbookingusecase.execute({ page, limit, status, search, date });
            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.ADMIN.BOOKING_FETCH_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
}
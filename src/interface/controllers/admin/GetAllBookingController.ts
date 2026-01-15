import { IGetAllBookingUseCase } from "../../../application/interface/use-cases/admin/IGetAllBookingUseCase";
import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";


export class GetAllBookingController {
    constructor(private _getallbookingusecase: IGetAllBookingUseCase) { }

    async execute(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string;

            const result = await this._getallbookingusecase.execute(page, limit, status);
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.ADMIN.BOOKING_FETCH_SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
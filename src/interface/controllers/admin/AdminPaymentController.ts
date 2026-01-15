import { Request, Response, NextFunction } from "express";
import { IGetPaymentsUseCase } from "../../../application/interface/use-cases/admin/IGetPaymentsUseCase";
import { GetPaymentsRequestDTO } from "../../../application/dtos/admin/GetPaymentsRequestDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class AdminPaymentController {
    constructor(private readonly _getPaymentsUseCase: IGetPaymentsUseCase) { }

    async getAllPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const type = req.query.type as string;
            const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
            const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

            const requestDTO = new GetPaymentsRequestDTO(
                page,
                limit,
                search,
                status,
                type,
                startDate,
                endDate
            );

            const result = await this._getPaymentsUseCase.execute(requestDTO);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.PAYMENT.FETCH_SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { IGetAllReviewsUseCase } from "../../../application/interface/use-cases/user/review/IGetAllReviewsUsecase";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class ReviewController {
    constructor(private readonly _getAllReviewsUseCase: IGetAllReviewsUseCase) { }

    async getAllReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const lawyerId = req.params.id;

            const reviews = await this._getAllReviewsUseCase.execute(lawyerId);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.LAWYER.REVIEWS_FETCH_SUCCESS,
                data: reviews
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}
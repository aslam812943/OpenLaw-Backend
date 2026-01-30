import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { IGetAllReviewsUseCase } from "../../../application/interface/use-cases/user/review/IGetAllReviewsUsecase";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class ReviewController {
    constructor(private readonly _getAllReviewsUseCase: IGetAllReviewsUseCase) { }

    async getAllReviews(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const lawyerId = req.params.id;

            const reviews = await this._getAllReviewsUseCase.execute(lawyerId);

            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.REVIEWS_FETCH_SUCCESS, reviews);
        } catch (error: unknown) {
            next(error);
        }
    }
}
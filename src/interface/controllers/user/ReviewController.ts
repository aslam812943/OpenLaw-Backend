import { Request, Response, NextFunction } from "express";
import { IAddReviewUseCase } from "../../../application/interface/use-cases/user/review/IAddReviewUseCase";
import { AddReviewDTO } from "../../../application/dtos/user/review/AddReviewDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { IGetAllReviewsUseCase } from "../../../application/interface/use-cases/user/review/IGetAllReviewsUsecase";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class ReviewController {
  constructor(
    private readonly _addReviewUseCase: IAddReviewUseCase,
    private readonly _getAllReviewsUseCase: IGetAllReviewsUseCase
  ) { }

  async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, lawyerId, rating, comment } = req.body;

      if (!userId || !lawyerId || !rating || !comment) {
        return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, MessageConstants.COMMON.BAD_REQUEST);
      }

      const reviewDTO = new AddReviewDTO(userId, lawyerId, rating, comment);
      const review = await this._addReviewUseCase.execute(reviewDTO);

      return ApiResponse.success(res, HttpStatusCode.CREATED, MessageConstants.LAWYER.REVIEWS_FETCH_SUCCESS, review);
    } catch (error: unknown) {
      next(error);
    }
  }

  async getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const lawyerId = req.params.id;
      const reviews = await this._getAllReviewsUseCase.execute(lawyerId);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.REVIEWS_FETCH_SUCCESS, reviews);
    } catch (error) {
      next(error);
    }
  }
}

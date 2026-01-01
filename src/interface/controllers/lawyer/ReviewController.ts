import { Request,Response,NextFunction } from "express";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { IGetAllReviewsUseCase } from "../../../application/interface/use-cases/user/review/IGetAllReviewsUsecase";



export class ReviewController {
    constructor(private getAllReviewUseCase: IGetAllReviewsUseCase) { }

    async getAllReview(req: Request, res: Response, next: NextFunction) {
        try {
            const lawyerId = req.params.id

            const response = await this.getAllReviewUseCase.execute(lawyerId)

            res.status(HttpStatusCode.OK).json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}
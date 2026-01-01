import { Request, Response, NextFunction } from "express";
import { IAddReviewUseCase } from "../../../application/interface/use-cases/user/review/IAddReviewUseCase";
import { AddReviewDTO } from "../../../application/dtos/user/review/AddReviewDTO";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { IGetAllReviewsUseCase } from "../../../application/interface/use-cases/user/review/IGetAllReviewsUsecase";
export class ReviewController {
    constructor(private addReviewUseCase: IAddReviewUseCase,private allreviewusecase:IGetAllReviewsUseCase) { }

    async addReview(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, lawyerId, rating, comment } = req.body;

            if (!userId || !lawyerId || !rating || !comment) {
                throw new BadRequestError("Missing required fields");
            }

            const reviewDTO = new AddReviewDTO(userId, lawyerId, rating, comment);
            const review = await this.addReviewUseCase.execute(reviewDTO);

            res.status(HttpStatusCode.CREATED).json({ success: true, data: review, message: "Review added successfully" });
        } catch (error) {
            next(error);
        }
    }
  async getAllReview(req:Request,res:Response,next:NextFunction){
    try {
        const lawyerId = req.params.id

      const response =   await this.allreviewusecase.execute(lawyerId)
     
      res.status(HttpStatusCode.OK).json({data:response})
    } catch (error) {
        next(error)
    }
  }

    
}

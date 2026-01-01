import { IAddReviewUseCase } from "../../../interface/use-cases/user/review/IAddReviewUseCase";
import { AddReviewDTO } from "../../../dtos/user/review/AddReviewDTO";
import { ReviewResponseDTO } from "../../../dtos/user/review/ReviewResponseDTO";
import { IReviewRepository } from "../../../../domain/repositories/IReviewRepository";
import { Review } from "../../../../domain/entities/Review";

export class AddReviewUseCase implements IAddReviewUseCase {
    constructor(private reviewRepository: IReviewRepository) { }

    async execute(reviewData: AddReviewDTO): Promise<ReviewResponseDTO> {
      
        const review = new Review(
            reviewData.userId,
            reviewData.lawyerId,
            reviewData.rating,
            reviewData.comment,
            new Date()
        );

        const savedReview = await this.reviewRepository.addReview(review);

        return new ReviewResponseDTO(
            savedReview._id as string,
            savedReview.userId,
            savedReview.lawyerId,
            savedReview.rating,
            savedReview.comment,
            savedReview.createdAt as Date
        );
    }
}

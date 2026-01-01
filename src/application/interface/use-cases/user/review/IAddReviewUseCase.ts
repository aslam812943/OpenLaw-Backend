import { AddReviewDTO } from "../../../../dtos/user/review/AddReviewDTO";
import { ReviewResponseDTO } from "../../../../dtos/user/review/ReviewResponseDTO";

export interface IAddReviewUseCase {
    execute(reviewData: AddReviewDTO): Promise<ReviewResponseDTO>;
}

import { Review } from "../entities/Review";

export interface IReviewRepository {
    addReview(review: Review): Promise<Review>;
    findAll(lawyerId: string): Promise<Review[]>;
    findByUserIdAndLawyerId(userId: string, lawyerId: string): Promise<Review | null>;
}

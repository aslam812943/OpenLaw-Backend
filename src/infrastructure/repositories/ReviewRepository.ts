import { IReviewRepository } from "../../domain/repositories/IReviewRepository";
import { Review } from "../../domain/entities/Review";
import { ReviewModel, IReview } from "../db/models/ReviewModel";

export class ReviewRepository implements IReviewRepository {
    async addReview(review: Review): Promise<Review> {


        const newReview = new ReviewModel(review);

        const savedReview = await newReview.save();


        return new Review(
            savedReview.userId.toString(),
            savedReview.lawyerId.toString(),
            savedReview.rating,
            savedReview.comment,
            savedReview.createdAt,
            (savedReview as any)._id.toString()
        );

    }


    async findAll(lawyerId: string): Promise<Review[]> {
        const reviews = await ReviewModel.find({ lawyerId }).populate("userId", "name profileImage").sort({ createdAt: -1 })

        return reviews.map(review => {
            const user = review.userId as any;
            const userId = (review.userId as any)?._id || review.userId || "unknown";
            return new Review(
                String(userId),
                String(review.lawyerId),
                review.rating,
                review.comment,
                review.createdAt,
                (review as any)._id,
                user?.name || "Anonymous User",
                user?.profileImage || ""
            )
        });
    }

    private mapToEntity(doc: IReview): Review {
        const userId = (doc.userId as any)?._id || doc.userId || "unknown";

        return new Review(
            String(userId),
            String(doc.lawyerId),
            doc.rating,
            doc.comment,
            doc.createdAt,
            doc._id as string
        )
    }
}

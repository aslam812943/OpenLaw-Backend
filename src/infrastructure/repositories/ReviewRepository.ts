import mongoose, { Types } from "mongoose";
import { IReviewRepository } from "../../domain/repositories/IReviewRepository";
import { Review } from "../../domain/entities/Review";
import { ReviewModel, IReview } from "../db/models/ReviewModel";

export class ReviewRepository implements IReviewRepository {
    async addReview(review: Review): Promise<Review> {
        try {
            const newReview = new ReviewModel({
                userId: review.userId,
                lawyerId: review.lawyerId,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt || new Date()
            });

            const savedReview = await newReview.save();

            return this.mapToEntity(savedReview);
        } catch (error: unknown) {

            throw error;
        }
    }


    async findAll(lawyerId: string): Promise<Review[]> {
        const reviews = await ReviewModel.find({ lawyerId }).populate("userId", "name profileImage").sort({ createdAt: -1 })

        return reviews.map(review => {
            const user = review.userId as unknown as { _id: Types.ObjectId; name: string; profileImage: string };
            const userId = user?._id || review.userId || "unknown";
            return new Review(
                String(userId),
                String(review.lawyerId),
                review.rating,
                review.comment,
                review.createdAt,
                String(review._id),
                user?.name || "Anonymous User",
                user?.profileImage || ""
            )
        });
    }

    async findByUserIdAndLawyerId(userId: string, lawyerId: string): Promise<Review | null> {
        const doc = await ReviewModel.findOne({ userId, lawyerId });
        if (!doc) return null;
        return this.mapToEntity(doc);
    }

    private mapToEntity(doc: IReview): Review {
        const userId = doc.userId && typeof doc.userId === 'object' && '_id' in doc.userId ? String((doc.userId as { _id: Types.ObjectId })._id) : String(doc.userId || "unknown");

        return new Review(
            userId,
            String(doc.lawyerId),
            doc.rating,
            doc.comment,
            doc.createdAt,
            String(doc._id)
        )
    }
}

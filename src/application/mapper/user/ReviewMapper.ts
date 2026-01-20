
import { GetAllReviewDTO } from "../../dtos/user/review/GetAllReviewDTO"

import { Review } from "../../../domain/entities/Review"

export class ReviewMapper {
    static toDto(data: Review[]): GetAllReviewDTO[] {
        return data.map((d) => {
            // const user = d.userId || {}; 

            return new GetAllReviewDTO(
                d._id?.toString() || d.userId?.toString() || "",
                d.userId?.toString() || "",
                d.userName || "Anonymous",
                d.userImage || "/default-user.jpg",
                Number(d.rating ?? 0),
                d.comment,
                d.createdAt || new Date()
            )
        })
    }
}

import { GetAllReviewDTO } from "../../dtos/user/review/GetAllReviewDTO"

export class ReviewMapper {
    static toDto(data: any[]): GetAllReviewDTO[] {
        return data.map((d) => {
            // const user = d.userId || {}; 

            return new GetAllReviewDTO(
                d._id?.toString() || d.userId?.toString(),
                d.userId?._id?.toString() || d.userId?.toString(),
                d.userName || "Anonymous",
                d.userImage || "/default-user.jpg",
                Number(d.rating ?? 0),
                d.comment,
                d.createdAt
            )
        })
    }
}
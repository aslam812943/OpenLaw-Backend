export class ReviewResponseDTO {
    id: string;
    userId: string;
    lawyerId: string;
    rating: number;
    comment: string;
    createdAt: Date;

    constructor(id: string, userId: string, lawyerId: string, rating: number, comment: string, createdAt: Date) {
        this.id = id;
        this.userId = userId;
        this.lawyerId = lawyerId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }
}

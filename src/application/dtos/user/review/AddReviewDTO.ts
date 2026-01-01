export class AddReviewDTO {
    userId: string;
    lawyerId: string;
    rating: number;
    comment: string;

    constructor(userId: string, lawyerId: string, rating: number, comment: string) {
        this.userId = userId;
        this.lawyerId = lawyerId;
        this.rating = rating;
        this.comment = comment;
    }
}

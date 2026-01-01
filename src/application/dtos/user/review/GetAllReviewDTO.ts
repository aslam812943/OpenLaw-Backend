export class GetAllReviewDTO {
    constructor(
        public id:string,
        public userId: string,
        public userName: string,
        public userImage: string,
        public rating: number,
        public comment: string,
        public createdAt: Date
    ) {

    }
}
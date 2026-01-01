
export class Review {
    constructor(
        public userId: string,
        public lawyerId: string,
        public rating: number,
        public comment: string,
        public createdAt?: Date,
        public _id?: string,
        public userName?: string,
        public userImage?: string
    ) { }
}

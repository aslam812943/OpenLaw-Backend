export class ResponseGetAppoimnetsDTO{
    constructor(
        public id:string,
        public userId:string,
        public date:string,
        public consultationFee:number,
        public startTime:string,
        public endTime:string,
        public status:string,
        public paymentStatus:string,
        public desctiption:string,
        public userName:string
    ){}
}
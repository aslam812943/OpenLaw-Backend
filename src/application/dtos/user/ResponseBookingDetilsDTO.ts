
export class ResponseBookingDetilsDTO{
    constructor(
        public id: string,
        public date: string,
        public startTime: string,
        public endTime: string,
        public consultationFee: number,
        public lawyerName: string,
        public lawyerImage?: string,
        public paymentId?: string,
        public sessionId?: string,
        public description?: string
    ){
     
    }
}
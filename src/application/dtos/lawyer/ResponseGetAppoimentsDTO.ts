export class ResponseGetAppoimnetsDTO {
    constructor(
        public id: string,
        public userId: string,
        public date: string,
        public consultationFee: number,
        public startTime: string,
        public endTime: string,
        public status: string,
        public paymentStatus: string,
        public desctiption: string,
        public userName: string,
        public lawyerId?: string,
        public lawyerFeedback?: string,
        public bookingId?: string,
        public followUpType?: string,
        public followUpDate?: string,
        public followUpTime?: string,
        public followUpStatus?: string,
        public parentBookingId?: string
    ) { }
}
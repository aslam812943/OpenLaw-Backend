
export class BookingSuccessDetailsDTO {
    constructor(
        public bookingId: string,
        public lawyerName: string,
        public consultationFee: number,
        public date: string,
        public startTime: string,
        public endTime: string,
        public lawyerImage?: string,
        public description?: string,
        public paymentId?: string,
        public sessionId?: string
    ) { }
}

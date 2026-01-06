export class ResponseGetAppointments {
    constructor(
        public id: string,
        public lawyerId: string,
        public date: string,
        public startTime: string,
        public endTime: string,
        public consultationFee: number,
        public status: string,
        public description: string,
        public lawyerName: string,
        public cancellationReason: string | undefined,
        public refundAmount?: number,
        public refundStatus?: string
    ) { }
}

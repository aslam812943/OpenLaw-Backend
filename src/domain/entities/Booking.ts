export class Booking {
    constructor(
        public id: string,
        public userId: string,
        public lawyerId: string,
        public date: string,
        public startTime: string,
        public endTime: string,
        public consultationFee: number,
        public status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected',
        public paymentStatus: 'pending' | 'paid' | 'failed',
        public paymentId?: string,
        public stripeSessionId?: string,
        public description?: string,
        public userName?: string,
        public cancellationReason?: string,
        public lawyerName?: string,
        public refundAmount?: number,
        public refundStatus?: 'none' | 'full' | 'partial',
        public createdAt?: Date
    ) { }
}

export class Payment {
    constructor(
        public id: string,
        public bookingId: string,
        public userId: string,
        public lawyerId: string,
        public amount: number,
        public currency: string,
        public status: 'pending' | 'completed' | 'failed' | 'refunded',
        public transactionId: string, 
        public paymentMethod: string,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}

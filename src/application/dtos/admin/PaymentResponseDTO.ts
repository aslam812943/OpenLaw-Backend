export class PaymentResponseDTO {
    constructor(
        public id: string,
        public lawyerName: string,
        public userName: string, 
        public amount: number,
        public currency: string,
        public status: string,
        public type: string,
        public transactionId: string,
        public date: Date,
        public paymentMethod: string
    ) { }
}

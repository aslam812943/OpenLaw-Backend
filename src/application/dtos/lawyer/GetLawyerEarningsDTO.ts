export class TransactionDTO {
    constructor(
        public bookingId: string,
        public date: string,
        public userName: string,
        public amount: number,
        public status: string,
        public paymentStatus: string
    ) { }
}

export class GetLawyerEarningsDTO {
    constructor(
        public totalEarnings: number,
        public transactions: TransactionDTO[]
    ) { }
}

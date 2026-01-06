export class TransactionDTO {
    constructor(
        public bookingId: string,
        public date: string,
        public userName: string,
        public amount: number,
        public commissionAmount: number,
        public netAmount: number,
        public status: string,
        public paymentStatus: string
    ) { }
}

export class GetLawyerEarningsDTO {
    constructor(
        public totalEarnings: number,
        public transactions: TransactionDTO[],
        public walletBalance: number,
        public pendingBalance: number
    ) { }
}

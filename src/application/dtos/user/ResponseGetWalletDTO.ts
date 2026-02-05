export class WalletTransactionDTO {
    constructor(
        public type: 'credit' | 'debit',
        public amount: number,
        public date: Date,
        public status: 'pending' | 'completed' | 'failed',
        public bookingId?: string,
        public description?: string,
        public metadata?: {
            reason?: string;
            lawyerName?: string;
            lawyerId?: string;
            date?: string;
            time?: string;
            displayId?: string;
        }
    ) { }
}

export class ResponseGetWalletDTO {
    constructor(
        public balance: number,
        public transactions: WalletTransactionDTO[],
        public total: number
    ) { }
}

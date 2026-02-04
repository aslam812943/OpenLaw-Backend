export interface WalletTransaction {
    type: 'credit' | 'debit';
    amount: number;
    date: Date;
    status: 'pending' | 'completed' | 'failed';
    bookingId?: string;
    description?: string;
    metadata?: {
        reason?: string;
        lawyerName?: string;
        lawyerId?: string;
        date?: string;
        time?: string;
        displayId?: string;
    };
}
export class Wallet {
    constructor(
        public userId: string,
        public balance: number,
        public transactions: WalletTransaction[],
        public id?: string
    ) { }
}
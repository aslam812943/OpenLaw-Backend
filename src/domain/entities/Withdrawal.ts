export class Withdrawal {
    constructor(
        public lawyerId: string,
        public amount: number,
        public status: 'pending' | 'approved' | 'rejected',
        public requestDate: Date,
        public processedDate?: Date,
        public commissionAmount?: number,
        public finalAmount?: number,
        public id?: string,
        public lawyerName?: string
    ) { }
}

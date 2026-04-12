export class Subscription {
    constructor(
        public id: string,
        public planName: string,
        public duration: number,
        public durationUnit: string,
        public price: number,
        public commissionPercent: number,
        public lawyerCancellationPenaltyPercent: number,
        public isActive: boolean = true
    ) { }
}

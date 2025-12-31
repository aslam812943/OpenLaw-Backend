export class SubscriptionDTO {
    constructor(
        public id: string,
        public planName: string,
        public duration: number,
        public durationUnit: string,
        public price: number,
        public commissionPercent: number,
        public isActive: boolean
    ) { }
}

export class CreateSubscriptionDTO{
    constructor(
        public planName:string,
        public duration:number,
        public durationUnit:string,
        public price :number,
        public commissionPercent:number
    ){}
}
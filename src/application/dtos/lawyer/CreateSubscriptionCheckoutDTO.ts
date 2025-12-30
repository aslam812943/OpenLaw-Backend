export class CreateSubscriptionCheckoutDTO {
    constructor(
        public lawyerId: string,
        public email: string,
        public planName: string,
        public price: number,
        public subscriptionId: string
    ) { }
}

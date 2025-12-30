export class GetPaymentsRequestDTO {
    constructor(
        public page: number = 1,
        public limit: number = 10,
        public search?: string,
        public status?: string,
        public type?: string,
        public startDate?: Date,
        public endDate?: Date
    ) { }
}

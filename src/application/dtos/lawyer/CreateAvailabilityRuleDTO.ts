export class CreateAvailabilityRuleDTO {
    constructor(

        public title: string,
        public startTime: string,
        public endTime: string,
        public startDate: string,
        public endDate: string,
        public availableDays: string[],
        public bufferTime: number,
        public slotDuration: number,
        public maxBookings: number,
        public sessionType: string,
        public exceptionDays: string[],
        public lawyerId: string,
        public consultationFee: number
    ) { }
}
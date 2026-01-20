export class ResponseGetALLSlotsDTO {
    constructor(
        public id: string,
        public date: string,
        public startTime: string,
        public endTime: string,
        public sessionType: string,
        public isBooked: boolean,
        public consultationFee: number
    ) { }
}
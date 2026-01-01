export class ResponseGetAppoiments {
    constructor(
        public id: string,
        public lawyerId: string,
        public date: string,
        public startTime: string,
        public endTime: string,
        public consultationFee: number,
        public status: string,
        public description: string,
        public lawyerName: string,
        public cancellationTeason: string | undefined

    ) {

    }
}
export class GetLawyerCasesDTO {
    constructor(
        public id: string,
        public userId: string,
        public userName: string,
        public date: string,
        public startTime: string,
        public endTime: string,
        public desctiption: string,
        public status: string
    ) { }
}

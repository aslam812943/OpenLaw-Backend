

export class ResponseGetProfileDTO{
    constructor(
        public barNumber:string,
        public barAdmissionDate:string,
        public yearsOfPractice:number,
        public practiceAreas:string[],
        public languages:string[],
        public documentUrls:string[],
        public address: (string | number)[],
        public  name:string,
        public email:string,
        public phone:number,
        public profileImage?:string,
        public bio?:string
    ){}
}
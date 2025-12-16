export class ResponseBookingDetilsDTO{
    constructor(
        public id:string,
        public date:string,
        public startTime:string,
        public endTime:string,
        public  description?:string
    ){
     
    }
}
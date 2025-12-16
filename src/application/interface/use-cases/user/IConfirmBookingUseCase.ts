import { Booking } from "../../../../domain/entities/Booking";
import { ResponseBookingDetilsDTO } from "../../../dtos/user/ResponseBookingDetilsDTO";

export interface IConfirmBookingUseCase  {
    execute(sessionId:string):Promise<ResponseBookingDetilsDTO>
}


export interface ICreateBookingPaymentUseCase{
    execute(bookingDetails:any):Promise<string>
}
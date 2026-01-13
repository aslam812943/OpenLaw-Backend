import { Booking } from "../../../../domain/entities/Booking";
import { ResponseBookingDetilsDTO } from "../../../dtos/user/ResponseBookingDetilsDTO";
import { BookingDTO } from "../../../dtos/user/BookingDetailsDTO";

export interface IConfirmBookingUseCase {
    execute(sessionId: string): Promise<ResponseBookingDetilsDTO>
}


export interface ICreateBookingPaymentUseCase {
    execute(bookingDetails: BookingDTO): Promise<string>
}
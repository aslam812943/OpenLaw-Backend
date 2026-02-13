import { BookingDTO } from "../../../dtos/user/BookingDetailsDTO";
import { ResponseBookingDetilsDTO } from "../../../dtos/user/ResponseBookingDetilsDTO";

export interface IBookWithWalletUseCase {
    execute(bookingDetails: BookingDTO): Promise<ResponseBookingDetilsDTO>;
}

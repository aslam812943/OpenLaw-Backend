import { AdminBookingDTO } from "../../../dtos/admin/AdminBookingDTO";
import { BookingSearchDTO } from "../../../dtos/common/BookingSearchDTO";

export interface IGetAllBookingUseCase {
    execute(searchDTO: BookingSearchDTO): Promise<{ bookings: AdminBookingDTO[], total: number }>
}
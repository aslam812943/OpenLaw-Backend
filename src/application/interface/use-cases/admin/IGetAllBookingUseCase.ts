import { AdminBookingDTO } from "../../../dtos/admin/AdminBookingDTO";

export interface IGetAllBookingUseCase {
    execute(page: number, limit: number, status?: string): Promise<{ bookings: AdminBookingDTO[], total: number }>
}
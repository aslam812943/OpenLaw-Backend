import { IGetAllBookingUseCase } from "../../interface/use-cases/admin/IGetAllBookingUseCase";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { AdminBookingDTO } from "../../dtos/admin/AdminBookingDTO";
import { AdminBookingMapper } from "../../mapper/admin/AdminBookingMapper";


export class GetAllBookingUseCase implements IGetAllBookingUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
    ) { }


    async execute(page: number, limit: number, status?: string): Promise<{ bookings: AdminBookingDTO[], total: number }> {
        const { bookings, total } = await this._bookingRepository.findAll(page, limit, status);

        const bookingsWithCommission = bookings.map((booking) => {
            return AdminBookingMapper.toDTO(booking, booking.commissionPercent || 0);
        });

        return {
            bookings: bookingsWithCommission,
            total
        };
    }
}
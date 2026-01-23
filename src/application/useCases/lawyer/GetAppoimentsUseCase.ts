import { IGetAppoimentsUseCase } from "../../interface/use-cases/lawyer/IGetAppoimentsUseCase";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ResponseGetAppoimnetsDTO } from "../../dtos/lawyer/ResponseGetAppoimentsDTO";
import { AppoimentMapper } from "../../mapper/lawyer/AppoimentMapper";
import { BookingSearchDTO } from "../../dtos/common/BookingSearchDTO";


export class GetAppoimentsUseCase implements IGetAppoimentsUseCase {
    constructor(private _bookingRepository: IBookingRepository) { }

    async execute(id: string, searchDTO: BookingSearchDTO): Promise<{ appointments: ResponseGetAppoimnetsDTO[], total: number }> {
        const { bookings, total } = await this._bookingRepository.findByLawyerId(
            id,
            searchDTO.page,
            searchDTO.limit,
            searchDTO.status,
            searchDTO.search,
            searchDTO.date
        );

        return {
            appointments: AppoimentMapper.toDTO(bookings),
            total
        };
    }
}

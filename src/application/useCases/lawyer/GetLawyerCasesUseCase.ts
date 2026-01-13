import { IGetLawyerCasesUseCase } from "../../interface/use-cases/lawyer/IGetLawyerCasesUseCase";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { LawyerCasesMapper } from "../../mapper/lawyer/LawyerCasesMapper";
import { GetLawyerCasesDTO } from "../../dtos/lawyer/GetLawyerCasesDTO";

export class GetLawyerCasesUseCase implements IGetLawyerCasesUseCase {
    constructor(private _bookingRepository: IBookingRepository) { }

    async execute(lawyerId: string): Promise<GetLawyerCasesDTO[]> {
        const bookings = await this._bookingRepository.findByLawyerId(lawyerId);
        const confirmedBookings = bookings.filter(b => b.status === "confirmed");
        return LawyerCasesMapper.toDTO(confirmedBookings);
    }
}

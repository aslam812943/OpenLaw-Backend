import { IGetLawyerEarningsUseCase } from "../../interface/use-cases/lawyer/IGetLawyerEarningsUseCase";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { GetLawyerEarningsDTO } from "../../dtos/lawyer/GetLawyerEarningsDTO";
import { LawyerEarningsMapper } from "../../mapper/lawyer/LawyerEarningsMapper";

export class GetLawyerEarningsUseCase implements IGetLawyerEarningsUseCase {
    constructor(private bookingRepository: IBookingRepository) { }

    async execute(lawyerId: string): Promise<GetLawyerEarningsDTO> {
        
        const bookings = await this.bookingRepository.findByLawyerId(lawyerId);

       
        return LawyerEarningsMapper.toDTO(bookings);
    }
}

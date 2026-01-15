import { IGetLawyerEarningsUseCase } from "../../interface/use-cases/lawyer/IGetLawyerEarningsUseCase";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { GetLawyerEarningsDTO } from "../../dtos/lawyer/GetLawyerEarningsDTO";
import { LawyerEarningsMapper } from "../../mapper/lawyer/LawyerEarningsMapper";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class GetLawyerEarningsUseCase implements IGetLawyerEarningsUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _lawyerRepository: ILawyerRepository,
    ) { }

    async execute(lawyerId: string): Promise<GetLawyerEarningsDTO> {
        const [bookings, lawyer] = await Promise.all([
            this._bookingRepository.findByLawyerId(lawyerId),
            this._lawyerRepository.findById(lawyerId)
        ]);

        if (!lawyer) {
            throw new NotFoundError("Lawyer not found.");
        }

        return LawyerEarningsMapper.toDTO(bookings, lawyer.walletBalance || 0);
    }

}

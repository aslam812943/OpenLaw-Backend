import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IGetUserAppointmentsUseCase } from "../../interface/use-cases/user/IGetUserAppointmentsUseCase";
import { Booking } from "../../../domain/entities/Booking";
import { ResponseGetAppoiments } from "../../dtos/user/ResponseGetAppoiments";
import { UserAppointmentsMapper } from "../../mapper/user/userAppoimentsMapper";

export class GetUserAppointmentsUseCase implements IGetUserAppointmentsUseCase {
    constructor(private bookingRepository: IBookingRepository) { }

    async execute(userId: string): Promise<ResponseGetAppoiments[]> {

     
        let data = await this.bookingRepository.findByUserId(userId);

        return UserAppointmentsMapper.mapToDto(data);


    }
}

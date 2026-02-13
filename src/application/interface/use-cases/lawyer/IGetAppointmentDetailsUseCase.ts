import { ResponseGetAppoimnetsDTO } from "../../../dtos/lawyer/ResponseGetAppoimentsDTO";

export interface IGetAppointmentDetailsUseCase {
    execute(bookingId: string): Promise<ResponseGetAppoimnetsDTO>;
}

import { RescheduleBookingDTO } from "../../../dtos/user/RescheduleBookingDTO";

export interface IRescheduleBookingUseCase {
    execute(userId: string, dto: RescheduleBookingDTO): Promise<void>;
}

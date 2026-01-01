import { Booking } from "../../../domain/entities/Booking";
import { GetLawyerCasesDTO } from "../../dtos/lawyer/GetLawyerCasesDTO";

export class LawyerCasesMapper {
    static toDTO(bookings: Booking[]): GetLawyerCasesDTO[] {
        return bookings.map(booking => new GetLawyerCasesDTO(
            booking.id,
            booking.userId,
            booking.userName || "Unknown Client",
            booking.date,
            booking.startTime,
            booking.endTime,
            booking.description || "",
            booking.status
        ));
    }
}

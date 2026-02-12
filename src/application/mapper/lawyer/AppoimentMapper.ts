import { ResponseGetAppoimnetsDTO } from "../../dtos/lawyer/ResponseGetAppoimentsDTO";
import { Booking } from "../../../domain/entities/Booking";
export class AppoimentMapper {
    static toDTO(data: Booking[]): ResponseGetAppoimnetsDTO[] {
        return data.map((b) => {
            return new ResponseGetAppoimnetsDTO(
                b.id,
                b.userId,
                b.date,
                b.consultationFee,
                b.startTime,
                b.endTime,
                b.status,
                b.paymentStatus,
                b.description ?? '',
                b.userName ?? '',
                b.lawyerId,
                b.lawyerFeedback,
                b.bookingId,
                b.followUpType,
                b.followUpDate,
                b.followUpTime,
                b.followUpStatus
            );
        });
    }
}


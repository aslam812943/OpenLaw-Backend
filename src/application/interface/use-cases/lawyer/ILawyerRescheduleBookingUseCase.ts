export interface LawyerRescheduleDTO {
    bookingId: string;
    newSlotId: string;
}

export interface ILawyerRescheduleBookingUseCase {
    execute(lawyerId: string, data: LawyerRescheduleDTO): Promise<void>;
}

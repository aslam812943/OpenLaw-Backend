export interface AdminBookingDTO {
    id: string;
    userName: string;
    lawyerName: string;
    date: string;
    startTime: string;
    endTime: string;
    consultationFee: number;
    adminCommission: number;
    lawyerEarnings: number;
    status: string;
    paymentStatus: string;
    createdAt?: Date;
}

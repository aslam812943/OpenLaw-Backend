export class BookingDTO {
  userId: string;
  lawyerId: string;
  lawyerName: string;
  date: string;
  startTime: string;
  endTime: string;
  consultationFee: number;
  description: string;
  slotId:string
  constructor(data: {
    userId: string;
    lawyerId: string;
    lawyerName: string;
    date: string;
    startTime: string;
    endTime: string;
    consultationFee: number;
    description: string;
    slotId:string;
  }) {
    this.userId = data.userId;
    this.lawyerId = data.lawyerId;
    this.lawyerName = data.lawyerName;
    this.date = data.date;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.consultationFee = data.consultationFee;
    this.description = data.description;
    this.slotId = data.slotId
  }
}

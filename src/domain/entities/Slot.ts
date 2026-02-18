

export class Slot {
  constructor(
    public id: string,
    public ruleId: string,
    public userId: string,
    public startTime: string,
    public endTime: string,
    public date: string,
    public sessionType: string,
    public isBooked: boolean,
    public bookingId?: string | null,
    public maxBookings: number = 1,
    public restrictedTo?: string | null
  ) { }
}

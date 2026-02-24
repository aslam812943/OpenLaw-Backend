export class RescheduleBookingDTO {
    public bookingId: string;
    public newSlotId: string;

    constructor(data: { bookingId: string, newSlotId: string }) {
        this.bookingId = data.bookingId;
        this.newSlotId = data.newSlotId;
    }
}

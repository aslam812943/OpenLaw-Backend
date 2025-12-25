export class ChatRoomDTO {
    constructor(
        public id: string,
        public userId: string,
        public lawyerId: string,
        public bookingId: string
    ) { }
}

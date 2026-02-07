export class PopulatedChatRoomDTO {
    constructor(
        public id: string,
        public userId: {
            _id: string;
            name: string;
            profileImage?: string;
        } | string,
        public lawyerId: {
            _id: string;
            name: string;
            profileImage?: string;
        } | string,
        public bookingId: string,
        public createdAt: Date,
        public lastMessage?: {
            content: string;
            createdAt: Date;
        }
    ) { }
}

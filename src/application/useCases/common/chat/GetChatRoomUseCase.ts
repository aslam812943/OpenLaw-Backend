import { IChatRoomRepository } from "../../../../domain/repositories/IChatRoomRepository";
import { IBookingRepository } from "../../../../domain/repositories/IBookingRepository";
import { NotFoundError } from "../../../../infrastructure/errors/NotFoundError";
import { ChatRoomDTO } from "../../../dtos/chat/ChatRoomDTO";
import { PopulatedChatRoomDTO } from "../../../dtos/chat/PopulatedChatRoomDTO";
import { ChatRoomMapper } from "../../../mapper/chat/ChatRoomMapper";
import { PopulatedChatRoomMapper } from "../../../mapper/chat/PopulatedChatRoomMapper";
import { IGetChatRoomUseCase } from "../../../interface/use-cases/common/chat/IGetChatRoomUseCase";

export class GetChatRoomUseCase implements IGetChatRoomUseCase {
    constructor(
        private _chatRoomRepository: IChatRoomRepository,
        private _bookingRepository: IBookingRepository
    ) { }

    async execute(userId: string, lawyerId: string): Promise<ChatRoomDTO> {

        const activeBooking = await this._bookingRepository.findActiveBooking(userId, lawyerId);
        if (!activeBooking) {
            throw new NotFoundError("No active booking found with this lawyer.");
        }


        let room = await this._chatRoomRepository.findByUserAndLawyer(userId, lawyerId);

        if (room) {

            if (room.bookingId !== activeBooking.id) {
                await this._chatRoomRepository.updateBookingId(room.id, activeBooking.id);

                room.bookingId = activeBooking.id;
            }
            return ChatRoomMapper.toDTO(room);
        }
        const newRoom = await this._chatRoomRepository.save({
            id: "",
            userId,
            lawyerId,
            bookingId: activeBooking.id
        });

        return ChatRoomMapper.toDTO(newRoom);
    }

    async getById(roomId: string): Promise<PopulatedChatRoomDTO> {
        const room = await this._chatRoomRepository.findByIdPopulated(roomId);
        if (!room) throw new NotFoundError("Chat room not found");

        return PopulatedChatRoomMapper.toDTO(room);
    }

    async getByUser(userId: string): Promise<PopulatedChatRoomDTO[]> {
        const rooms = await this._chatRoomRepository.findByUserId(userId);
        return PopulatedChatRoomMapper.toDTOArray(rooms);
    }

    async getByLawyer(lawyerId: string): Promise<PopulatedChatRoomDTO[]> {
        const rooms = await this._chatRoomRepository.findByLawyerId(lawyerId);
        return PopulatedChatRoomMapper.toDTOArray(rooms);
    }
}

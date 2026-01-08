import { IMessageRepository } from "../../../../domain/repositories/IMessageRepository";
import { MessageDTO } from "../../../dtos/chat/MessageDTO";
import { MessageMapper } from "../../../mapper/chat/MessageMapper";
import { IGetMessagesUseCase } from "../../../interface/use-cases/common/chat/IGetMessagesUseCase";

export class GetMessagesUseCase implements IGetMessagesUseCase {
    constructor(private messageRepo: IMessageRepository) { }

    async execute(roomId: string): Promise<MessageDTO[]> {
        const messages = await this.messageRepo.getByRoom(roomId);
        return MessageMapper.toDTOArray(messages);
    }
}

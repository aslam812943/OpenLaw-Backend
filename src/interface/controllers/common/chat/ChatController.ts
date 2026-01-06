import { Request, Response, NextFunction } from "express";
import { CheckChatAccessUseCase } from "../../../../application/useCases/chat/CheckChatAccessUseCase";
import { GetChatRoomUseCase } from "../../../../application/useCases/chat/GetChatRoomUseCase";
import { GetMessagesUseCase } from "../../../../application/useCases/chat/GetMessagesUseCase";
import { HttpStatusCode } from "../../../../infrastructure/interface/enums/HttpStatusCode";

export class ChatController {
    constructor(
        private checkChatAccessUseCase: CheckChatAccessUseCase,
        private getChatRoomUseCase: GetChatRoomUseCase,
        private getMessagesUseCase: GetMessagesUseCase
    ) { }

    async checkAccess(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const { lawyerId } = req.params;


            const chatAccessDto = await this.checkChatAccessUseCase.execute(userId!, lawyerId);

            res.status(HttpStatusCode.OK).json({ success: true, hasAccess: chatAccessDto.hasAccess });
        } catch (error) {
            next(error);
        }
    }

    async getChatRoom(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const { lawyerId, userId: targetUserId } = req.body;

            const room = await this.getChatRoomUseCase.execute(
                targetUserId || userId,
                lawyerId || userId
            );
            res.status(HttpStatusCode.OK).json({ success: true, data: room });
        } catch (error) {
            next(error);
        }
    }

    async getRoomById(req: Request, res: Response, next: NextFunction) {
        try {
            const { roomId } = req.params;
            const room = await this.getChatRoomUseCase.getById(roomId);
            res.status(HttpStatusCode.OK).json({ success: true, data: room });
        } catch (error) {
            next(error);
        }
    }

    async getMessages(req: Request, res: Response, next: NextFunction) {
        try {
            const { roomId } = req.params;
            const messages = await this.getMessagesUseCase.execute(roomId);
            res.status(HttpStatusCode.OK).json({ success: true, data: messages });
        } catch (error) {
            next(error);
        }
    }

    async getUserRooms(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const rooms = await this.getChatRoomUseCase.getByUser(userId);
            res.status(HttpStatusCode.OK).json({ success: true, data: rooms });
        } catch (error) {
            next(error);
        }
    }

    async getLawyerRooms(req: Request, res: Response, next: NextFunction) {
        try {
            const lawyerId = (req as any).user.id;
            const rooms = await this.getChatRoomUseCase.getByLawyer(lawyerId);
            res.status(HttpStatusCode.OK).json({ success: true, data: rooms });
        } catch (error) {
            next(error);
        }
    }

    async uploadFile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                throw new Error("No file uploaded");
            }

            const fileUrl = (req.file as any).path;
            const fileName = req.file.originalname;
            const fileSize = req.file.size;

            res.status(HttpStatusCode.OK).json({
                success: true,
                data: {
                    fileUrl,
                    fileName,
                    fileSize
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

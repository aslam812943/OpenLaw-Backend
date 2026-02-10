import { Request, Response, NextFunction } from "express";
import { ICheckChatAccessUseCase } from "../../../../application/interface/use-cases/common/chat/ICheckChatAccessUseCase";
import { IGetChatRoomUseCase } from "../../../../application/interface/use-cases/common/chat/IGetChatRoomUseCase";
import { IGetMessagesUseCase } from "../../../../application/interface/use-cases/common/chat/IGetMessagesUseCase";
import { HttpStatusCode } from "../../../../infrastructure/interface/enums/HttpStatusCode";
import { ApiResponse } from "../../../../infrastructure/utils/ApiResponse";

export class ChatController {
    constructor(
        private _checkChatAccessUseCase: ICheckChatAccessUseCase,
        private _getChatRoomUseCase: IGetChatRoomUseCase,
        private _getMessagesUseCase: IGetMessagesUseCase
    ) { }

    async checkAccess(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userId = req.user?.id;
            const { lawyerId } = req.params;
            const chatAccessDto = await this._checkChatAccessUseCase.execute(userId!, lawyerId);
            return ApiResponse.success(res, HttpStatusCode.OK, "Access checked successfully", { hasAccess: chatAccessDto.hasAccess });
        } catch (error: unknown) {
            next(error);
        }
    }




    async getChatRoom(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userId = req.user?.id;
            const { lawyerId, userId: targetUserId, bookingId } = req.body;

            const room = await this._getChatRoomUseCase.execute(
                targetUserId || userId,
                lawyerId || userId,
                bookingId
            );
            return ApiResponse.success(res, HttpStatusCode.OK, "Chat room retrieved successfully", room);
        } catch (error: unknown) {
            next(error);
        }
    }

    async getRoomById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { roomId } = req.params;
            const room = await this._getChatRoomUseCase.getById(roomId);
            return ApiResponse.success(res, HttpStatusCode.OK, "Chat room retrieved successfully", room);
        } catch (error: unknown) {
            next(error);
        }
    }

    async getMessages(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { roomId } = req.params;
            const messages = await this._getMessagesUseCase.execute(roomId);
            return ApiResponse.success(res, HttpStatusCode.OK, "Messages retrieved successfully", messages);
        } catch (error) {
            next(error);
        }
    }

    async getUserRooms(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userId = req.user?.id;
            const rooms = await this._getChatRoomUseCase.getByUser(userId!);
            return ApiResponse.success(res, HttpStatusCode.OK, "User rooms retrieved successfully", rooms);
        } catch (error: unknown) {
            next(error);
        }
    }

    async getLawyerRooms(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const lawyerId = req.user?.id;
            const rooms = await this._getChatRoomUseCase.getByLawyer(lawyerId!);
            return ApiResponse.success(res, HttpStatusCode.OK, "Lawyer rooms retrieved successfully", rooms);
        } catch (error: unknown) {
            next(error);
        }
    }

    async getLawyerSpecificRooms(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const currentId = req.user?.id;
            const { lawyerId, userId } = req.params;

            // If lawyerId is provided, we assume the current user is a Client looking for a specific Lawyer's rooms
            // If userId is provided, we assume the current user is a Lawyer looking for a specific Client's rooms
            const rooms = await this._getChatRoomUseCase.getLawyerSpecificRooms(
                userId || currentId!,
                lawyerId || currentId!
            );
            return ApiResponse.success(res, HttpStatusCode.OK, "Chat rooms retrieved successfully", rooms);
        } catch (error: unknown) {
            next(error);
        }
    }

    async uploadFile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (!req.file) {
                throw new Error("No file uploaded");
            }

            const fileUrl = (req.file as Express.Multer.File).path;
            const fileName = req.file.originalname;
            const fileSize = req.file.size;

            return ApiResponse.success(res, HttpStatusCode.OK, "File uploaded successfully", {
                fileUrl,
                fileName,
                fileSize
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}

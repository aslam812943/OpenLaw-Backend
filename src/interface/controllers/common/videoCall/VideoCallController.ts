import { Request, Response, NextFunction } from "express";
import { ICanJoinCallUseCase } from "../../../../application/interface/use-cases/common/ICanJoinCallUseCase";
import { IJoinCallUseCase } from "../../../../application/interface/use-cases/common/IJoinCallUseCase";
import { HttpStatusCode } from "../../../../infrastructure/interface/enums/HttpStatusCode";

export class VideoCallController {
    constructor(
        private canJoinCallUseCase: ICanJoinCallUseCase,
        private joinCallUseCase: IJoinCallUseCase
    ) { }

    async canJoinCall(req: Request, res: Response, next: NextFunction) {
        try {
            const { bookingId } = req.params;
            const userId = req.user?.id;
            const role = req.user?.role as 'user' | 'lawyer';

            if (!userId || !role) {
                throw new Error("Unauthorized");
            }

            const result = await this.canJoinCallUseCase.execute(bookingId, userId, role);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

    async joinCall(req: Request, res: Response, next: NextFunction) {
        try {
            const { bookingId } = req.params;

            await this.joinCallUseCase.execute(bookingId);
            res.status(HttpStatusCode.OK).json({ success: true, message: "Joined call successfully" });
        } catch (error) {
            next(error);
        }
    }
}

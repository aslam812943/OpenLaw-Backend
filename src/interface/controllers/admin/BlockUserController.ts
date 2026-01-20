import { Request, Response, NextFunction } from "express";
import { IBlockUserUseCase } from "../../../application/interface/use-cases/admin/IBlockUserUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class BlockUserController {
    constructor(private readonly _blockUserUseCase: IBlockUserUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;

            await this._blockUserUseCase.execute(userId);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: MessageConstants.USER.BLOCK_SUCCESS,
            });

        } catch (err: unknown) {
            next(err);
        }
    }
}

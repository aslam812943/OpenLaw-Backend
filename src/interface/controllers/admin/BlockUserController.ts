
import { Request, Response } from "express";
import { IBlockUserUseCase } from "../../../application/interface/use-cases/admin/IBlockUserUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";


//  BlockUserController

export class BlockUserController {
    constructor(private _blockuserUseCase: IBlockUserUseCase) { }


    async handle(req: Request, res: Response, next: any): Promise<void> {
        try {
            const userId = req.params.id;

            await this._blockuserUseCase.execute(userId);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "User blocked successfully.",
            });

        } catch (err: any) {
            next(err);
        }
    }
}

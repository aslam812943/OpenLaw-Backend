import { Request, Response, NextFunction } from "express";
import { IUNBlockUserUseCase } from "../../../application/interface/use-cases/admin/IUNBlockUserUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class UNBlockUserController {
  constructor(private readonly _unblockUserUseCase: IUNBlockUserUseCase) { }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;

      await this._unblockUserUseCase.execute(userId);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.USER.UNBLOCK_SUCCESS,
      });
    } catch (error: any) {
      next(error);
    }
  }
}

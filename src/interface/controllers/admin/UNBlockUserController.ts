import { Request, Response, NextFunction } from "express";
import { IUNBlockUserUseCase } from "../../../application/interface/use-cases/admin/IUNBlockUserUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class UNBlockUserController {
  constructor(private readonly _unblockUserUseCase: IUNBlockUserUseCase) { }

  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.params.id;

      await this._unblockUserUseCase.execute(userId);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.USER.UNBLOCK_SUCCESS);
    } catch (error: unknown) {
      next(error);
    }
  }
}

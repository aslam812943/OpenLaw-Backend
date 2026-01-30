import { Request, Response, NextFunction } from "express";
import { IUNBlockLawyerUseCase } from "../../../application/interface/use-cases/admin/IUnBlockLawyerUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class UNBlockLawyerController {
  constructor(private readonly _unblockLawyerUseCase: IUNBlockLawyerUseCase) { }

  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const lawyerId = req.params.id;

      await this._unblockLawyerUseCase.execute(lawyerId);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.UNBLOCK_SUCCESS);
    } catch (error: unknown) {
      next(error);
    }
  }
}

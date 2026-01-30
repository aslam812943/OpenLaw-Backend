import { Request, Response, NextFunction } from "express";
import { IRejectLawyerUseCase } from "../../../application/interface/use-cases/admin/IRejectLawyerUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class RejectLawyerController {
  constructor(private readonly _rejectLawyerUseCase: IRejectLawyerUseCase) { }

  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const lawyerId = req.params.id;
      const { reason, email } = req.body;

      await this._rejectLawyerUseCase.execute(lawyerId, email, reason);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.REJECT_SUCCESS);
    } catch (err: unknown) {
      next(err);
    }
  }
}

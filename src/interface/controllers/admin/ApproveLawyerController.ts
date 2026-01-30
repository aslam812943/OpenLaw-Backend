import { Request, Response, NextFunction } from "express";
import { IApproveLawyerUseCase } from "../../../application/interface/use-cases/admin/IApproveLawyerUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class ApproveLawyerController {
  constructor(private readonly _approveLawyerUseCase: IApproveLawyerUseCase) { }

  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const lawyerId = req.params.id;
      const { email } = req.body;

      await this._approveLawyerUseCase.execute(lawyerId, email);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.APPROVE_SUCCESS);

    } catch (error: unknown) {
      next(error);
    }
  }
}

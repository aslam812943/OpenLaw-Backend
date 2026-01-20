import { Request, Response, NextFunction } from "express";
import { IApproveLawyerUseCase } from "../../../application/interface/use-cases/admin/IApproveLawyerUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class ApproveLawyerController {
  constructor(private readonly _approveLawyerUseCase: IApproveLawyerUseCase) { }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lawyerId = req.params.id;
      const { email } = req.body;

      await this._approveLawyerUseCase.execute(lawyerId, email);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.LAWYER.APPROVE_SUCCESS,
      });

    } catch (error: unknown) {
      next(error);
    }
  }
}

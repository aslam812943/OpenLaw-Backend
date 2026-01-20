import { Request, Response, NextFunction } from "express";
import { IRejectLawyerUseCase } from "../../../application/interface/use-cases/admin/IRejectLawyerUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class RejectLawyerController {
  constructor(private readonly _rejectLawyerUseCase: IRejectLawyerUseCase) { }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lawyerId = req.params.id;
      const { reason, email } = req.body;

      await this._rejectLawyerUseCase.execute(lawyerId, email, reason);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.LAWYER.REJECT_SUCCESS,
      });
    } catch (err: unknown) {
      next(err);
    }
  }
}

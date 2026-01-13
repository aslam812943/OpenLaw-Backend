
import { Request, Response } from "express";
import { IRejectLawyerUseCase } from "../../../application/interface/use-cases/admin/IRejectLawyerUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";


//  RejectLawyerController

export class RejectLawyerController {
  constructor(private readonly _rejectLawyerUseCase: IRejectLawyerUseCase) { }


  async handle(req: Request, res: Response, next: any): Promise<void> {
    try {
      const lawyerId = req.params.id;
      const { reason, email } = req.body;

      await this._rejectLawyerUseCase.execute(lawyerId, email, reason);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Lawyer rejected successfully.",
      });
    } catch (err: any) {
      next(err);
    }
  }
}

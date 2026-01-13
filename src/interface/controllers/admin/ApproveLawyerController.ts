
import { Request, Response } from "express";
import { IApproveLawyerUseCase } from "../../../application/interface/use-cases/admin/IApproveLawyerUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";


//  ApproveLawyerController

export class ApproveLawyerController {
  constructor(private readonly _approveLawyerUseCase: IApproveLawyerUseCase) { }

  async handle(req: Request, res: Response, next: any): Promise<void> {
    try {
      const lawyerId = req.params.id;
      const { email } = req.body;

      await this._approveLawyerUseCase.execute(lawyerId, email);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Lawyer approved successfully.",
      });

    } catch (error: any) {
      next(error);
    }
  }
}

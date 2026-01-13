
import { Request, Response } from "express";
import { IUNBlockLawyerUseCase } from "../../../application/interface/use-cases/admin/IUnBlockLawyerUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";


//  UNBlockLawyerController

export class UNBlockLawyerController {
  constructor(private readonly _unblockLawyerUseCase: IUNBlockLawyerUseCase) { }


  async handle(req: Request, res: Response, next: any): Promise<void> {
    try {
      const lawyerId = req.params.id;

      await this._unblockLawyerUseCase.execute(lawyerId);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Lawyer unblocked successfully.",
      });
    } catch (error: any) {
      next(error);
    }
  }
}

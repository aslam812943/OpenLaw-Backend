
import { IBlockLawyerUseCase } from "../../../application/interface/use-cases/admin/IBlockLawyerUseCase";
import { Request, Response } from "express";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";


//  BlockLawyerController

export class BlockLawyerController {
  constructor(private readonly _blockLawyerUseCase: IBlockLawyerUseCase) { }

  async handle(req: Request, res: Response, next: any): Promise<void> {
    try {
      const  lawyerId  = req.params.id;

      await this._blockLawyerUseCase.execute(lawyerId);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Lawyer blocked successfully.",
      });
    } catch (error: any) {
      next(error);
    }
  }
}

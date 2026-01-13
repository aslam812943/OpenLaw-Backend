
import { Request, Response } from "express";
import { IUNBlockUserUseCase } from "../../../application/interface/use-cases/admin/IUNBlockUserUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";


//  UNBlockUserController

export class UNBlockUserController {
  constructor(private readonly _unblockUserUseCase: IUNBlockUserUseCase) { }


  async handle(req: Request, res: Response, next: any): Promise<void> {
    try {
      const userId = req.params.id;

      await this._unblockUserUseCase.execute(userId);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "User unblocked successfully.",
      });
    } catch (error: any) {
      next(error);
    }
  }
}

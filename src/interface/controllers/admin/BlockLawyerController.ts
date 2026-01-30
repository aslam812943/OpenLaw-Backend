import { Request, Response, NextFunction } from "express";
import { IBlockLawyerUseCase } from "../../../application/interface/use-cases/admin/IBlockLawyerUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class BlockLawyerController {
  constructor(private readonly _blockLawyerUseCase: IBlockLawyerUseCase) { }

  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const lawyerId = req.params.id;

      await this._blockLawyerUseCase.execute(lawyerId);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.BLOCK_SUCCESS);
    } catch (error: unknown) {
      next(error);
    }
  }
}

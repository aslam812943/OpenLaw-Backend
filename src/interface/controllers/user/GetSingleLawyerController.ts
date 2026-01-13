import { Request, Response, NextFunction } from "express";
import { IGetSingleLawyerUseCase } from "../../../application/interface/use-cases/user/IGetAllLawyersUseCase";
import { IGetAllSlotsUseCase } from "../../../application/interface/use-cases/user/IGetAllLawyersUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class GetSingleLawyerController {
  constructor(
    private readonly _getSingleLawyerUseCase: IGetSingleLawyerUseCase,
    private readonly _getAllSlotsUseCase: IGetAllSlotsUseCase
  ) { }

  async getLawyer(req: Request, res: Response, next: NextFunction) {
    try {
      const lawyerId = req.params.id;
      

      if (!lawyerId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: MessageConstants.COMMON.BAD_REQUEST
        });
      }

      const lawyer = await this._getSingleLawyerUseCase.execute(lawyerId);

      if (!lawyer) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          success: false,
          message: MessageConstants.COMMON.INTERNAL_ERROR 
        });
      }

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.LAWYER.FETCH_SUCCESS,
        data: lawyer,
      });

    } catch (error) {
      next(error);
    }
  }

  async getAllSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: MessageConstants.COMMON.BAD_REQUEST
        });
      }

      const slots = await this._getAllSlotsUseCase.execute(id);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.COMMON.SUCCESS,
        data: slots,
      });

    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { IGetSingleLawyerUseCase } from "../../../application/interface/use-cases/user/IGetAllLawyersUseCase";
import { IGetAllSlotsUseCase } from "../../../application/interface/use-cases/user/IGetAllLawyersUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class GetSingleLawyerController {
  constructor(
    private readonly _getSingleLawyerUseCase: IGetSingleLawyerUseCase,
    private readonly _getAllSlotsUseCase: IGetAllSlotsUseCase
  ) { }

  async getLawyer(req: Request, res: Response, next: NextFunction) {
    try {
      const lawyerId = req.params.id;


      if (!lawyerId) {
        return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, MessageConstants.COMMON.BAD_REQUEST);
      }

      const lawyer = await this._getSingleLawyerUseCase.execute(lawyerId);

      if (!lawyer) {
        return ApiResponse.error(res, HttpStatusCode.NOT_FOUND, MessageConstants.COMMON.INTERNAL_ERROR);
      }

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.FETCH_SUCCESS, lawyer);

    } catch (error: unknown) {
      next(error);
    }
  }

  async getAllSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (!id) {
        return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, MessageConstants.COMMON.BAD_REQUEST);
      }

      const slots = await this._getAllSlotsUseCase.execute(id);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.COMMON.SUCCESS, slots);

    } catch (error: unknown) {
      next(error);
    }
  }
}

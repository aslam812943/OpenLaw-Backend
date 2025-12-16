import { Request, Response, NextFunction } from "express";
import { IGetSingleLawyerUseCase } from "../../../application/interface/use-cases/user/IGetAllLawyersUseCase";
import { IGetAllSlotsUseCase } from "../../../application/interface/use-cases/user/IGetAllLawyersUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { AppError } from "../../../infrastructure/errors/AppError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class GetSingleLawyerController {
  constructor(
    private _getsinglelawyerusecase: IGetSingleLawyerUseCase,
    private _getslotusecase: IGetAllSlotsUseCase
  ) { }

  async getlawyer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (!id) {
        throw new BadRequestError("Lawyer ID is required.");
      }

      const lawyer = await this._getsinglelawyerusecase.execute(id);

      if (!lawyer) {
        throw new NotFoundError("Lawyer not found.");
      }

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Lawyer fetched successfully",
        data: lawyer,
      });

    } catch (error) {
      next(error);
    }
  }


  async getallslots(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (!id) {
        throw new BadRequestError("Lawyer ID is required to fetch slots.");
      }

      const slots = await this._getslotusecase.execute(id);

      if (!slots || slots.length === 0) {
        throw new NotFoundError("No slots available for this lawyer.");
      }

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Slots fetched successfully",
        data: slots,
      });

    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import {
  ICreateAvailabilityRuleUseCase,
  IUpdateAvailabilityRuleUseCase,
  IGetAllAvailableRuleUseCase,
  IDeleteAvailableRuleUseCase
} from "../../../application/interface/use-cases/lawyer/ICreateAvailabilityRuleUseCase";

import { CreateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/CreateAvailabilityRuleDTO";
import { UpdateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/UpdateAvailabilityRuleDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";


export class AvailabilityController {
  constructor(
    private readonly _createRuleUseCase: ICreateAvailabilityRuleUseCase,
    private readonly _updateAvilableUseCase: IUpdateAvailabilityRuleUseCase,
    private readonly _getavailableUsecase: IGetAllAvailableRuleUseCase,
    private readonly _deleteavailableusecase: IDeleteAvailableRuleUseCase
  ) { }


  async createRule(req: Request, res: Response, next: NextFunction) {
    try {
      const ruleData = req.body.ruleData;

      const lawyerId = req.user?.id

      if (!lawyerId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Lawyer ID is missing. Unable to create rule.",
        });
      }

      const dto = new CreateAvailabilityRuleDTO(
        ruleData.title,
        ruleData.startTime,
        ruleData.endTime,
        ruleData.startDate,
        ruleData.endDate,
        ruleData.availableDays,
        ruleData.bufferTime.toString(),
        ruleData.slotDuration,
        ruleData.maxBookings,
        ruleData.sessionType,
        ruleData.exceptionDays,
        lawyerId,
        ruleData.consultationFee
      );

      const result = await this._createRuleUseCase.execute(dto);

      return res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: "Availability rule and slots created successfully.",
        data: result,
      });
    } catch (err: any) {

      next(err)
    }
  }

 
  async updateRule(req: Request, res: Response, next: NextFunction) {

    try {
      const ruleId = req.params.ruleId;

      if (!ruleId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Rule ID is required for updating.",
        });
      }

      const dto = new UpdateAvailabilityRuleDTO(
        req.body.title,
        req.body.startTime,
        req.body.endTime,
        req.body.startDate,
        req.body.endDate,
        req.body.availableDays,
        req.body.bufferTime,
        req.body.slotDuration,
        req.body.maxBookings,
        req.body.sessionType,
        req.body.exceptionDays
      );

      const result = await this._updateAvilableUseCase.execute(ruleId, dto);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Rule updated successfully. Slots regenerated.",
        data: result,
      });
    } catch (err: any) {
      next(err)
    }
  }




  async getAllRuls(req: Request, res: Response, next: NextFunction) {

    try {
      const lawyerId = req.user?.id

      if (!lawyerId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Lawyer ID missing. Cannot fetch rules.",
        });
      }

      const rules = await this._getavailableUsecase.execute(lawyerId);


      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Availability rules fetched successfully.",
        data: rules,
      });
    } catch (err: any) {
      next(err)
    }
  }

 
  async DeleteRule(req: Request, res: Response, next: NextFunction) {
    try {
      const ruleId = req.params.ruleId;

      if (!ruleId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Rule ID missing. Cannot delete rule.",
        });
      }

      await this._deleteavailableusecase.execute(ruleId);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Rule and its slots deleted successfully.",
      });
    } catch (err: any) {
      next(err)
    }
  }
}

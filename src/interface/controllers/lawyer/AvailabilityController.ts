import { Request, Response } from "express";
import { ICreateAvailabilityRuleUseCase } from "../../../application/useCases/interface/lawyer/ICreateAvailabilityRuleUseCase";
import { IUpdateAvailabilityRuleUseCase } from "../../../application/useCases/interface/lawyer/ICreateAvailabilityRuleUseCase";
import { IGetAllAvailableRuleUseCase } from "../../../application/useCases/interface/lawyer/ICreateAvailabilityRuleUseCase";
import { IDeleteAvailableRuleUseCase } from "../../../application/useCases/interface/lawyer/ICreateAvailabilityRuleUseCase";

import { CreateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/CreateAvailabilityRuleDTO";
import { UpdateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/UpdateAvailabilityRuleDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class AvailabilityController {
  constructor(
    private readonly _createRuleUseCase: ICreateAvailabilityRuleUseCase,
    private readonly _updateAvilableUseCase: IUpdateAvailabilityRuleUseCase,
    private readonly _getavailableUsecase: IGetAllAvailableRuleUseCase,
    private readonly _deleteavailableusecase: IDeleteAvailableRuleUseCase
  ) {}

  /**
   * Create a new availability rule
   */
  async createRule(req: Request, res: Response) {
    try {
      const data = req.body.ruleData;
      const lawyerId = req.user?.id

      if (!lawyerId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Lawyer ID is missing. Unable to create rule.",
        });
      }

      const dto = new CreateAvailabilityRuleDTO(
        data.title,
        data.startTime,
        data.endTime,
        data.startDate,
        data.endDate,
        data.availableDays,
        data.bufferTime.toString(),
        data.slotDuration,
        data.maxBookings,
        data.sessionType,
        data.exceptionDays,
        lawyerId
      );

      const result = await this._createRuleUseCase.execute(dto);

      return res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: "Availability rule and slots created successfully.",
        data: result,
      });
    } catch (err: any) {
     
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "Unexpected error while creating rule.",
      });
    }
  }

  /**
   * Update an existing availability rule
   */
  async updateRule(req: Request, res: Response) {
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
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "Unexpected error while updating rule.",
      });
    }
  }

  /**
   * Fetch all availability rules for a lawyer
   */
  async getAllRuls(req: Request, res: Response) {
    try {
      const lawyerId =  req.user?.id 

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
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "Failed to fetch availability rules.",
      });
    }
  }

  /**
   * Delete a rule and its slots
   */
  async DeleteRule(req: Request, res: Response) {
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
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "Failed to delete rule.",
      });
    }
  }
}

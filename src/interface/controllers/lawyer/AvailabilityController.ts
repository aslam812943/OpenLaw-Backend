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
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";






export class AvailabilityController {
  constructor(
    private readonly _createRuleUseCase: ICreateAvailabilityRuleUseCase,
    private readonly _updateAvailableUseCase: IUpdateAvailabilityRuleUseCase,
    private readonly _getAllRulesUseCase: IGetAllAvailableRuleUseCase,
    private readonly _deleteRuleUseCase: IDeleteAvailableRuleUseCase
  ) { }

  async createRule(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const ruleData = req.body.ruleData;
      const lawyerId = req.user?.id;

      if (!lawyerId) {
        return ApiResponse.error(res, HttpStatusCode.FORBIDDEN, MessageConstants.COMMON.UNAUTHORIZED);
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

      return ApiResponse.success(res, HttpStatusCode.CREATED, MessageConstants.LAWYER.AVAILABILITY_UPDATE_SUCCESS, result);
    } catch (err: unknown) {
      next(err);
    }
  }

  async updateRule(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const ruleId = req.params.ruleId;

      if (!ruleId) {
        return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, MessageConstants.COMMON.BAD_REQUEST);
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
        req.body.exceptionDays,
        req.body.consultationFee
      );

      const result = await this._updateAvailableUseCase.execute(ruleId, dto);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.AVAILABILITY_UPDATE_SUCCESS, result);
    } catch (err: unknown) {
      next(err);
    }
  }

  async getAllRules(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const lawyerId = req.user?.id;

      if (!lawyerId) {
        return ApiResponse.error(res, HttpStatusCode.FORBIDDEN, MessageConstants.COMMON.UNAUTHORIZED);
      }

      const rules = await this._getAllRulesUseCase.execute(lawyerId);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.AVAILABILITY_FETCH_SUCCESS, rules);
    } catch (err: unknown) {
      next(err);
    }
  }

  async deleteRule(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const ruleId = req.params.ruleId;

      if (!ruleId) {
        return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, MessageConstants.COMMON.BAD_REQUEST);
      }

      await this._deleteRuleUseCase.execute(ruleId);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.COMMON.SUCCESS);
    } catch (err: unknown) {
      next(err);
    }
  }
}

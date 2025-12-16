"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityController = void 0;
const CreateAvailabilityRuleDTO_1 = require("../../../application/dtos/lawyer/CreateAvailabilityRuleDTO");
const UpdateAvailabilityRuleDTO_1 = require("../../../application/dtos/lawyer/UpdateAvailabilityRuleDTO");
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
class AvailabilityController {
    constructor(_createRuleUseCase, _updateAvilableUseCase, _getavailableUsecase, _deleteavailableusecase) {
        this._createRuleUseCase = _createRuleUseCase;
        this._updateAvilableUseCase = _updateAvilableUseCase;
        this._getavailableUsecase = _getavailableUsecase;
        this._deleteavailableusecase = _deleteavailableusecase;
    }
    /**
     * Create a new availability rule
     */
    async createRule(req, res, next) {
        try {
            const data = req.body.ruleData;
            const lawyerId = req.user?.id;
            if (!lawyerId) {
                return res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Lawyer ID is missing. Unable to create rule.",
                });
            }
            const dto = new CreateAvailabilityRuleDTO_1.CreateAvailabilityRuleDTO(data.title, data.startTime, data.endTime, data.startDate, data.endDate, data.availableDays, data.bufferTime.toString(), data.slotDuration, data.maxBookings, data.sessionType, data.exceptionDays, lawyerId, data.consultationFee);
            const result = await this._createRuleUseCase.execute(dto);
            return res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json({
                success: true,
                message: "Availability rule and slots created successfully.",
                data: result,
            });
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * Update an existing availability rule
     */
    async updateRule(req, res, next) {
        try {
            const ruleId = req.params.ruleId;
            if (!ruleId) {
                return res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Rule ID is required for updating.",
                });
            }
            const dto = new UpdateAvailabilityRuleDTO_1.UpdateAvailabilityRuleDTO(req.body.title, req.body.startTime, req.body.endTime, req.body.startDate, req.body.endDate, req.body.availableDays, req.body.bufferTime, req.body.slotDuration, req.body.maxBookings, req.body.sessionType, req.body.exceptionDays);
            const result = await this._updateAvilableUseCase.execute(ruleId, dto);
            return res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Rule updated successfully. Slots regenerated.",
                data: result,
            });
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * Fetch all availability rules for a lawyer
     */
    async getAllRuls(req, res, next) {
        try {
            const lawyerId = req.user?.id;
            if (!lawyerId) {
                return res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Lawyer ID missing. Cannot fetch rules.",
                });
            }
            const rules = await this._getavailableUsecase.execute(lawyerId);
            return res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Availability rules fetched successfully.",
                data: rules,
            });
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * Delete a rule and its slots
     */
    async DeleteRule(req, res, next) {
        try {
            const ruleId = req.params.ruleId;
            if (!ruleId) {
                return res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Rule ID missing. Cannot delete rule.",
                });
            }
            await this._deleteavailableusecase.execute(ruleId);
            return res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Rule and its slots deleted successfully.",
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AvailabilityController = AvailabilityController;
//# sourceMappingURL=AvailabilityController.js.map
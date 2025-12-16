"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAvailabilityRuleUseCase = void 0;
const SlotGeneratorService_1 = require("../../../infrastructure/services/SlotGenerator/SlotGeneratorService");
const NotFoundError_1 = require("../../../infrastructure/errors/NotFoundError");
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
class UpdateAvailabilityRuleUseCase {
    constructor(_repo) {
        this._repo = _repo;
    }
    async execute(ruleId, dto) {
        try {
            const updateRule = await this._repo.updateRule(ruleId, dto);
            if (!updateRule)
                throw new NotFoundError_1.NotFoundError("Rule not found");
            await this._repo.deleteSlotsByRuleId(ruleId);
            const newSlots = SlotGeneratorService_1.SlotGeneratorService.generateSlots(updateRule);
            if (!newSlots)
                throw new BadRequestError_1.BadRequestError("Failed to generate slots");
            await this._repo.createSlots(ruleId, '', newSlots);
            return {
                rule: updateRule,
                slots: newSlots,
            };
        }
        catch (error) {
            throw new BadRequestError_1.BadRequestError(error.message || "Failed to update rule");
        }
    }
}
exports.UpdateAvailabilityRuleUseCase = UpdateAvailabilityRuleUseCase;
//# sourceMappingURL=UpdateAvailabilityRuleUseCase.js.map
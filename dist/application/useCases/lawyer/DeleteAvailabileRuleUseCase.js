"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAvailableRuleUseCase = void 0;
const AppError_1 = require("../../../infrastructure/errors/AppError");
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
class DeleteAvailableRuleUseCase {
    constructor(_ruleRepo) {
        this._ruleRepo = _ruleRepo;
    }
    async execute(ruleId) {
        try {
            await Promise.all([
                this._ruleRepo.deleteRuleById(ruleId),
                this._ruleRepo.deleteSlotsByRuleId(ruleId)
            ]);
            return;
        }
        catch (err) {
            if (err instanceof AppError_1.AppError)
                throw err;
            throw new BadRequestError_1.BadRequestError(err.message || "Failed to delete availability rule.");
        }
    }
}
exports.DeleteAvailableRuleUseCase = DeleteAvailableRuleUseCase;
//# sourceMappingURL=DeleteAvailabileRuleUseCase.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllAvailableRuleUseCase = void 0;
const AvailabilityRuleMapper_1 = require("../../mapper/lawyer/AvailabilityRuleMapper");
class GetAllAvailableRuleUseCase {
    constructor(_repo) {
        this._repo = _repo;
    }
    async execute(id) {
        // Fetch all availability rules for the lawyer
        const rules = await this._repo.getAllRules(id);
        return AvailabilityRuleMapper_1.AvailabilityRuleMapper.toDTOList(rules);
    }
}
exports.GetAllAvailableRuleUseCase = GetAllAvailableRuleUseCase;
//# sourceMappingURL=GetAllAvailabilityRulesUseCase.js.map
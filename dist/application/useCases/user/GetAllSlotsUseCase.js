"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSlotsUseCase = void 0;
const AvailabilityRuleMapper_1 = require("../../mapper/lawyer/AvailabilityRuleMapper");
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
class GetAllSlotsUseCase {
    constructor(_slotRepository) {
        this._slotRepository = _slotRepository;
    }
    async execute(lawyerId) {
        if (!lawyerId) {
            throw new BadRequestError_1.BadRequestError("Lawyer ID is required to fetch slots.");
        }
        const slots = await this._slotRepository.getAllSlots(lawyerId);
        return AvailabilityRuleMapper_1.AvailabilityRuleMapper.toDTOSlots(slots);
    }
}
exports.GetAllSlotsUseCase = GetAllSlotsUseCase;
//# sourceMappingURL=GetAllSlotsUseCase.js.map
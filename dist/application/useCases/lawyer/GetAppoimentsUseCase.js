"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppoimentsUseCase = void 0;
const AppoimentMapper_1 = require("../../mapper/lawyer/AppoimentMapper");
class GetAppoimentsUseCase {
    constructor(_appoimentRepo) {
        this._appoimentRepo = _appoimentRepo;
    }
    async execute(id) {
        // Fetch appointments for the lawyer
        const response = await this._appoimentRepo.getAppoiments(id);
        return AppoimentMapper_1.AppoimentMapper.toDTO(response);
    }
}
exports.GetAppoimentsUseCase = GetAppoimentsUseCase;
//# sourceMappingURL=GetAppoimentsUseCase.js.map
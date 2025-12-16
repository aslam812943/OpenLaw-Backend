"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSingleLawyerUseCase = void 0;
const LawyerMapper_1 = require("../../mapper/lawyer/LawyerMapper");
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
const NotFoundError_1 = require("../../../infrastructure/errors/NotFoundError");
class GetSingleLawyerUseCase {
    constructor(_repo) {
        this._repo = _repo;
    }
    async execute(id) {
        if (!id) {
            throw new BadRequestError_1.BadRequestError("Lawyer ID is required.");
        }
        const lawyer = await this._repo.findById(id);
        if (!lawyer) {
            throw new NotFoundError_1.NotFoundError("Lawyer not found.");
        }
        return LawyerMapper_1.LawyerMapper.toSingle(lawyer);
    }
}
exports.GetSingleLawyerUseCase = GetSingleLawyerUseCase;
//# sourceMappingURL=GetSingleLawyerUseCase.js.map
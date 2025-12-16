"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckLawyerStatusUseCase = void 0;
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
const NotFoundError_1 = require("../../../infrastructure/errors/NotFoundError");
class CheckLawyerStatusUseCase {
    constructor(_repo) {
        this._repo = _repo;
    }
    async check(id) {
        if (!id) {
            throw new BadRequestError_1.BadRequestError("Lawyer ID is required.");
        }
        // Check if the lawyer exists
        const lawyer = await this._repo.findById(id);
        if (!lawyer) {
            throw new NotFoundError_1.NotFoundError("Lawyer not found.");
        }
        return { isActive: !lawyer.isBlock };
    }
}
exports.CheckLawyerStatusUseCase = CheckLawyerStatusUseCase;
//# sourceMappingURL=CheckLawyerStatusUseCase.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllLawyersUseCase = void 0;
const UserLawyerMapper_1 = require("../../mapper/user/UserLawyerMapper");
const AppError_1 = require("../../../infrastructure/errors/AppError");
const NotFoundError_1 = require("../../../infrastructure/errors/NotFoundError");
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
class GetAllLawyersUseCase {
    constructor(_repo) {
        this._repo = _repo;
    }
    async execute(query) {
        try {
            const { lawyers, total } = await this._repo.findAll(query);
            if (!lawyers || lawyers.length === 0) {
                throw new NotFoundError_1.NotFoundError("No lawyers found.");
            }
            const lawyerDTOs = UserLawyerMapper_1.UserLawyerMapper.toGetLawyerListDTO(lawyers);
            return {
                success: true,
                total,
                lawyers: lawyerDTOs,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new BadRequestError_1.BadRequestError(error.message || "Failed to fetch lawyers. Please try again later.");
        }
    }
}
exports.GetAllLawyersUseCase = GetAllLawyersUseCase;
//# sourceMappingURL=GetAllLawyersUseCase.js.map
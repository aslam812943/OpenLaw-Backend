"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordUseCase = void 0;
const AppError_1 = require("../../../infrastructure/errors/AppError");
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
class ChangePasswordUseCase {
    constructor(_lawyer_repo) {
        this._lawyer_repo = _lawyer_repo;
    }
    async execute(dto) {
        try {
            if (!dto.id) {
                throw new BadRequestError_1.BadRequestError("Lawyer ID is required.");
            }
            if (!dto.oldPassword || !dto.newPassword) {
                throw new BadRequestError_1.BadRequestError("Old and new password are required.");
            }
            const result = await this._lawyer_repo.changePassword(dto.id, dto.oldPassword, dto.newPassword);
            return { message: "Password changed successfully." };
        }
        catch (err) {
            if (err instanceof AppError_1.AppError)
                throw err;
            throw new BadRequestError_1.BadRequestError(err.message || "Password change failed.");
        }
    }
}
exports.ChangePasswordUseCase = ChangePasswordUseCase;
//# sourceMappingURL=ChangePasswordUseCase.js.map
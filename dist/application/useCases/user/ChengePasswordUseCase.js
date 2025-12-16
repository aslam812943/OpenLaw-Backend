"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordUseCase = void 0;
const AppError_1 = require("../../../infrastructure/errors/AppError");
const NotFoundError_1 = require("../../../infrastructure/errors/NotFoundError");
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
class ChangePasswordUseCase {
    constructor(_user_repo) {
        this._user_repo = _user_repo;
    }
    async execute(dto) {
        const user = await this._user_repo.findById(dto.id);
        if (!user) {
            throw new NotFoundError_1.NotFoundError("User not found.");
        }
        try {
            const result = await this._user_repo.changePassword(dto.id, dto.oldPassword, dto.newPassword);
            return { message: "Password changed successfully." };
        }
        catch (err) {
            if (err instanceof AppError_1.AppError)
                throw err;
            throw new BadRequestError_1.BadRequestError("Something went wrong while changing the password. Please try again.");
        }
    }
}
exports.ChangePasswordUseCase = ChangePasswordUseCase;
//# sourceMappingURL=ChengePasswordUseCase.js.map
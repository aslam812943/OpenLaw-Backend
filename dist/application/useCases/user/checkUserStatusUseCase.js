"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckUserStatusUseCase = void 0;
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
const NotFoundError_1 = require("../../../infrastructure/errors/NotFoundError");
class CheckUserStatusUseCase {
    constructor(_repo) {
        this._repo = _repo;
    }
    async check(id) {
        if (!id) {
            throw new BadRequestError_1.BadRequestError("User ID is required.");
        }
        const user = await this._repo.findById(id);
        if (!user) {
            throw new NotFoundError_1.NotFoundError("User not found.");
        }
        return { isActive: !user.isBlock };
    }
}
exports.CheckUserStatusUseCase = CheckUserStatusUseCase;
//# sourceMappingURL=checkUserStatusUseCase.js.map
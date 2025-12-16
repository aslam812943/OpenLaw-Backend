"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileUseCase = void 0;
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
class UpdateProfileUseCase {
    constructor(_repo) {
        this._repo = _repo;
    }
    async execute(id, dto) {
        if (!id)
            throw new BadRequestError_1.BadRequestError("Invalid request: User ID is missing");
        if (!dto)
            throw new BadRequestError_1.BadRequestError('data missing ');
        // Update the lawyer profile in the repository
        await this._repo.updateProfile(id, dto);
    }
}
exports.UpdateProfileUseCase = UpdateProfileUseCase;
//# sourceMappingURL=UpdateProfileUseCase.js.map
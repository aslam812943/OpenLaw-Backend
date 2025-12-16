"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfileUseCase = void 0;
const GetProfileMapper_1 = require("../../mapper/lawyer/GetProfileMapper");
const AppError_1 = require("../../../infrastructure/errors/AppError");
const NotFoundError_1 = require("../../../infrastructure/errors/NotFoundError");
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
class GetProfileUseCase {
    constructor(_repo) {
        this._repo = _repo;
    }
    async execute(id) {
        try {
            const data = await this._repo.findById(id);
            if (!data) {
                throw new NotFoundError_1.NotFoundError(`Profile not found for user ID: ${id}`);
            }
            return GetProfileMapper_1.GetProfileMapper.toDTO(data);
        }
        catch (err) {
            if (err instanceof AppError_1.AppError)
                throw err;
            throw new BadRequestError_1.BadRequestError(err.message || "Failed to fetch profile data.");
        }
    }
}
exports.GetProfileUseCase = GetProfileUseCase;
//# sourceMappingURL=GetProfileUseCase.js.map
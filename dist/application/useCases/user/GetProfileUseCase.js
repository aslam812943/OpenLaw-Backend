"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfileUseCase = void 0;
const ResponseGetProfileDTO_1 = require("../../dtos/user/ResponseGetProfileDTO");
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
const NotFoundError_1 = require("../../../infrastructure/errors/NotFoundError");
class GetProfileUseCase {
    constructor(_repo) {
        this._repo = _repo;
    }
    async execute(id) {
        if (!id) {
            throw new BadRequestError_1.BadRequestError("User ID is required to fetch profile.");
        }
        const data = await this._repo.findById(id);
        if (!data) {
            throw new NotFoundError_1.NotFoundError(`User not found for ID: ${id}`);
        }
        const userDTO = new ResponseGetProfileDTO_1.ResponseGetProfileDTO(data.id ?? "", data.name ?? "", data.email ?? "", data.phone ? String(data.phone) : "", data.profileImage ?? "", data.address ?? {}, data.isPassword ?? true);
        return userDTO;
    }
}
exports.GetProfileUseCase = GetProfileUseCase;
//# sourceMappingURL=GetProfileUseCase.js.map
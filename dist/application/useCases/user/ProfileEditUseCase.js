"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileEditUseCase = void 0;
class ProfileEditUseCase {
    constructor(_userRepo) {
        this._userRepo = _userRepo;
    }
    async execute(data) {
        await this._userRepo.profileUpdate(data.id, data.name, data.phone, data.profileImage, data.address, data.city, data.state, data.pincode);
    }
}
exports.ProfileEditUseCase = ProfileEditUseCase;
//# sourceMappingURL=ProfileEditUseCase.js.map
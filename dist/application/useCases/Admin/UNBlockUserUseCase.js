"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNBlockuserUseCase = void 0;
class UNBlockuserUseCase {
    constructor(_userRepo) {
        this._userRepo = _userRepo;
    }
    async execute(id) {
        // Unblock the user in the repository
        await this._userRepo.unBlockUser(id);
    }
}
exports.UNBlockuserUseCase = UNBlockuserUseCase;
//# sourceMappingURL=UNBlockUserUseCase.js.map
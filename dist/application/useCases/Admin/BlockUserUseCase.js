"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockUserUseCase = void 0;
class BlockUserUseCase {
    constructor(_userRepo) {
        this._userRepo = _userRepo;
    }
    async execute(id) {
        // Block the user in the repository
        await this._userRepo.blockUser(id);
    }
}
exports.BlockUserUseCase = BlockUserUseCase;
//# sourceMappingURL=BlockUserUseCase.js.map
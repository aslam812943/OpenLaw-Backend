"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsersUseCase = void 0;
const AdminUserMapper_1 = require("../../mapper/admin/AdminUserMapper");
class GetAllUsersUseCase {
    constructor(_userRepo) {
        this._userRepo = _userRepo;
    }
    async execute({ page, limit }) {
        // Fetch all users from the repository with pagination
        const { users, total } = await this._userRepo.findAll(page, limit);
        // Map the users to DTOs
        const userDTOs = AdminUserMapper_1.AdminUserMapper.toUserSummaryListDTO(users);
        return { users: userDTOs, total };
    }
}
exports.GetAllUsersUseCase = GetAllUsersUseCase;
//# sourceMappingURL=GetAllUsersUseCase.js.map
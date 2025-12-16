"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserMapper = void 0;
const GetAllUserDTO_1 = require("../../dtos/admin/GetAllUserDTO");
class AdminUserMapper {
    static toUserSummaryDTO(user) {
        const dto = {
            _id: user.id ? user.id.toString() : "",
            name: user.name,
            email: user.email,
            phone: user.phone.toString(),
            isBlock: user.isBlock,
        };
        return new GetAllUserDTO_1.GetAllUserDTO(dto);
    }
    static toUserSummaryListDTO(users) {
        return users.map((user) => this.toUserSummaryDTO(user));
    }
}
exports.AdminUserMapper = AdminUserMapper;
//# sourceMappingURL=AdminUserMapper.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsersController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
//  GetAllUsersController
class GetAllUsersController {
    constructor(_getAllUserUseCase) {
        this._getAllUserUseCase = _getAllUserUseCase;
    }
    async handle(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { users, total } = await this._getAllUserUseCase.execute({ page, limit });
            return res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Users fetched successfully.",
                users,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.GetAllUsersController = GetAllUsersController;
//# sourceMappingURL=GetAllUsersController.js.map
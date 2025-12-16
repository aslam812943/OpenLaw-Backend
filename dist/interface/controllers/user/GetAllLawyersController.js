"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllLawyersController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
class GetAllLawyersController {
    constructor(_getallLawyersUseCase) {
        this._getallLawyersUseCase = _getallLawyersUseCase;
    }
    async GetAllLawyers(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = String(req.query.search || "");
            const sort = String(req.query.sort || "");
            const filter = String(req.query.practiceArea || "");
            const response = await this._getallLawyersUseCase.execute({
                page,
                limit,
                search,
                sort,
                filter,
                fromAdmin: false
            });
            return res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Lawyers fetched successfully.",
                response,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.GetAllLawyersController = GetAllLawyersController;
//# sourceMappingURL=GetAllLawyersController.js.map
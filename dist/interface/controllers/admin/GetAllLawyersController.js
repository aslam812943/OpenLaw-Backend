"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllLawyersController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
//  GetAllLawyersController
class GetAllLawyersController {
    constructor(_getAllLawyersUseCase) {
        this._getAllLawyersUseCase = _getAllLawyersUseCase;
    }
    async handle(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = String(req.query.search || "");
            const { lawyers, total } = await this._getAllLawyersUseCase.execute({
                page,
                limit,
                search,
                fromAdmin: true
            });
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Lawyers fetched successfully.",
                lawyers,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.GetAllLawyersController = GetAllLawyersController;
//# sourceMappingURL=GetAllLawyersController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveLawyerController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
//  ApproveLawyerController
class ApproveLawyerController {
    constructor(_approveLawyerUseCase) {
        this._approveLawyerUseCase = _approveLawyerUseCase;
    }
    async handle(req, res, next) {
        try {
            const id = req.params.id;
            const { email } = req.body;
            await this._approveLawyerUseCase.execute(id, email);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Lawyer approved successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ApproveLawyerController = ApproveLawyerController;
//# sourceMappingURL=ApproveLawyerController.js.map
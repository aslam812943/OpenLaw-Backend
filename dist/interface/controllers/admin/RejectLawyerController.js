"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectLawyerController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
//  RejectLawyerController
class RejectLawyerController {
    constructor(_rejectLawyerUseCase) {
        this._rejectLawyerUseCase = _rejectLawyerUseCase;
    }
    async handle(req, res, next) {
        try {
            const id = req.params.id;
            const { reason, email } = req.body;
            await this._rejectLawyerUseCase.execute(id, email, reason);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Lawyer rejected successfully.",
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.RejectLawyerController = RejectLawyerController;
//# sourceMappingURL=RejectLawyerController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNBlockLawyerController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
//  UNBlockLawyerController
class UNBlockLawyerController {
    constructor(_unblockLawyerUseCase) {
        this._unblockLawyerUseCase = _unblockLawyerUseCase;
    }
    async handle(req, res, next) {
        try {
            const id = req.params.id;
            //
            await this._unblockLawyerUseCase.execute(id);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Lawyer unblocked successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UNBlockLawyerController = UNBlockLawyerController;
//# sourceMappingURL=UNBlockLawyerController.js.map
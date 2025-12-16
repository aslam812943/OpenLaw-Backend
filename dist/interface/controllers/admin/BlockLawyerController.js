"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockLawyerController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
//  BlockLawyerController
class BlockLawyerController {
    constructor(_blockLawyerUseCase) {
        this._blockLawyerUseCase = _blockLawyerUseCase;
    }
    async handle(req, res, next) {
        try {
            const { id } = req.params;
            await this._blockLawyerUseCase.execute(id);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Lawyer blocked successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BlockLawyerController = BlockLawyerController;
//# sourceMappingURL=BlockLawyerController.js.map
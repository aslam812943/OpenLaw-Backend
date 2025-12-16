"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockUserController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
//  BlockUserController
class BlockUserController {
    constructor(_blockuserUseCase) {
        this._blockuserUseCase = _blockuserUseCase;
    }
    async handle(req, res, next) {
        try {
            const id = req.params.id;
            await this._blockuserUseCase.execute(id);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "User blocked successfully.",
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.BlockUserController = BlockUserController;
//# sourceMappingURL=BlockUserController.js.map
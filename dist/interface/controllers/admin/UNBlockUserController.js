"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNBlockUserController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
// ✅ UNBlockUserController
class UNBlockUserController {
    constructor(_unblockUserUseCase) {
        this._unblockUserUseCase = _unblockUserUseCase;
    }
    async handle(req, res, next) {
        try {
            const id = req.params.id;
            await this._unblockUserUseCase.execute(id);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "User unblocked successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UNBlockUserController = UNBlockUserController;
//# sourceMappingURL=UNBlockUserController.js.map
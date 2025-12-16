"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppoimentsController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
class AppoimentsController {
    constructor(_appoimentUseCase, _updateStatusUseCase) {
        this._appoimentUseCase = _appoimentUseCase;
        this._updateStatusUseCase = _updateStatusUseCase;
    }
    async getAppoiments(req, res, next) {
        try {
            let id = req.user?.id;
            let data = await this._appoimentUseCase.execute(id);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!this._updateStatusUseCase) {
                throw new Error("UpdateStatusUseCase not initialized");
            }
            await this._updateStatusUseCase.execute(id, status);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ success: true, message: "Appointment status updated successfully" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AppoimentsController = AppoimentsController;
//# sourceMappingURL=AppoimentsController.js.map
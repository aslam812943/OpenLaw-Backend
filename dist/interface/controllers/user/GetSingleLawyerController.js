"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSingleLawyerController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
const NotFoundError_1 = require("../../../infrastructure/errors/NotFoundError");
class GetSingleLawyerController {
    constructor(_getsinglelawyerusecase, _getslotusecase) {
        this._getsinglelawyerusecase = _getsinglelawyerusecase;
        this._getslotusecase = _getslotusecase;
    }
    async getlawyer(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestError_1.BadRequestError("Lawyer ID is required.");
            }
            const lawyer = await this._getsinglelawyerusecase.execute(id);
            if (!lawyer) {
                throw new NotFoundError_1.NotFoundError("Lawyer not found.");
            }
            return res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Lawyer fetched successfully",
                data: lawyer,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getallslots(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestError_1.BadRequestError("Lawyer ID is required to fetch slots.");
            }
            const slots = await this._getslotusecase.execute(id);
            if (!slots || slots.length === 0) {
                throw new NotFoundError_1.NotFoundError("No slots available for this lawyer.");
            }
            return res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Slots fetched successfully",
                data: slots,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.GetSingleLawyerController = GetSingleLawyerController;
//# sourceMappingURL=GetSingleLawyerController.js.map
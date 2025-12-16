"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfileController = void 0;
const UpdateLawyerProfileDTO_1 = require("../../../application/dtos/lawyer/UpdateLawyerProfileDTO");
const ChangePasswordDTO_1 = require("../../../application/dtos/lawyer/ChangePasswordDTO");
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
class GetProfileController {
    constructor(_getprofileusecase, _updateprofileusecase, _changepasswordusecase) {
        this._getprofileusecase = _getprofileusecase;
        this._updateprofileusecase = _updateprofileusecase;
        this._changepasswordusecase = _changepasswordusecase;
    }
    // ------------------------------------------
    //   GET PROFILE
    // ------------------------------------------
    async getDetils(req, res, next) {
        try {
            const id = req.user?.id;
            if (!id) {
                return res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                    success: false,
                    message: "Unauthorized: User ID missing",
                });
            }
            const data = await this._getprofileusecase.execute(id);
            return res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Profile fetched successfully",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // ------------------------------------------
    //   UPDATE PROFILE
    // ------------------------------------------
    async updateProfile(req, res, next) {
        const id = req.user?.id;
        if (!id) {
            return res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                success: false,
                message: "Unauthorized: User ID missing",
            });
        }
        try {
            const imageUrl = req.file ? req.file.path : "";
            const dto = new UpdateLawyerProfileDTO_1.UpdateLawyerProfileDTO(req.body.name, req.body.phone, req.body.address, req.body.city, req.body.state, req.body.pincode, imageUrl, req.body.bio);
            await this._updateprofileusecase.execute(id, dto);
            return res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Profile updated successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // ------------------------------------------
    //   CHANGE PASSWORD
    // ------------------------------------------
    async changePassword(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                    success: false,
                    message: 'Unauthorized: User ID missing'
                });
            }
            const dto = new ChangePasswordDTO_1.ChangePasswordDTO(userId, req.body.oldPassword, req.body.newPassword);
            await this._changepasswordusecase.execute(dto);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: 'Password changed successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.GetProfileController = GetProfileController;
//# sourceMappingURL=ProfileController.js.map
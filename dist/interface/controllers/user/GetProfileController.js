"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfileController = void 0;
const ChangePasswordDTO_1 = require("../../../application/dtos/user/ChangePasswordDTO");
const ProfileupdateDTO_1 = require("../../../application/dtos/user/ProfileupdateDTO");
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
class GetProfileController {
    constructor(_getprofileusecase, _chengepasswordusecase, _profileEditusecase) {
        this._getprofileusecase = _getprofileusecase;
        this._chengepasswordusecase = _chengepasswordusecase;
        this._profileEditusecase = _profileEditusecase;
    }
    async getprofiledetils(req, res, next) {
        try {
            const id = req.user?.id;
            const data = await this._getprofileusecase.execute(id);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: 'Profile fetch successful',
                data
            });
        }
        catch (error) {
            next(error);
        }
    }
    async chengePassword(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                    success: false,
                    message: 'Unauthorized: User ID missing'
                });
            }
            const dto = new ChangePasswordDTO_1.ChangePasswordDTO(userId, req.body.oldPassword, req.body.newPassword);
            await this._chengepasswordusecase.execute(dto);
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: 'Password changed successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async editProfile(req, res, next) {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                success: false,
                message: "Unauthorized: User ID missing",
            });
        }
        try {
            let profileImage = undefined;
            if (req.file) {
                profileImage = req.file.path;
            }
            const dto = new ProfileupdateDTO_1.ProfileUpdateDTO(userId, req.body.name, req.body.phone, profileImage, req.body.address, req.body.city, req.body.state, req.body.pincode);
            await this._profileEditusecase.execute(dto);
            return res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Profile updated successfully",
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.GetProfileController = GetProfileController;
//# sourceMappingURL=GetProfileController.js.map
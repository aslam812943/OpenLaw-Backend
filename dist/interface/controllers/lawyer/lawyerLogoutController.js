"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerLogoutController = void 0;
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
class LawyerLogoutController {
    async handle(_req, res, next) {
        try {
            res.clearCookie('lawyerAccessToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/'
            });
            res.clearCookie('lawyerRefreshToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/'
            });
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({
                success: true,
                message: "Lawyer logged out successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LawyerLogoutController = LawyerLogoutController;
//# sourceMappingURL=lawyerLogoutController.js.map
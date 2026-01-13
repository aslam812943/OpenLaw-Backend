import { Request, Response, NextFunction } from "express";
import { IGetProfileUseCase, IChangePasswordUseCase, IProfileEditUseCase } from "../../../application/interface/use-cases/user/IGetProfileUseCase";
import { ChangePasswordDTO } from "../../../application/dtos/user/ChangePasswordDTO";
import { ProfileUpdateDTO } from "../../../application/dtos/user/ProfileupdateDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class GetProfileController {
  constructor(
    private readonly _getProfileUseCase: IGetProfileUseCase,
    private readonly _changePasswordUseCase: IChangePasswordUseCase,
    private readonly _profileEditUseCase: IProfileEditUseCase
  ) { }

  async getProfileDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          success: false,
          message: MessageConstants.COMMON.UNAUTHORIZED
        });
      }

      const data = await this._getProfileUseCase.execute(userId);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.COMMON.SUCCESS,
        data
      });
    } catch (error: any) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          success: false,
          message: MessageConstants.COMMON.UNAUTHORIZED
        });
      }

      const dto = new ChangePasswordDTO(userId, req.body.oldPassword, req.body.newPassword);
      await this._changePasswordUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.USER.PASSWORD_CHANGE_SUCCESS
      });
    } catch (error: any) {
      next(error);
    }
  }

  async editProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          success: false,
          message: MessageConstants.COMMON.UNAUTHORIZED
        });
      }

      let profileImage = undefined;
      if (req.file) {
        profileImage = (req.file as any).path;
      }
      const dto = new ProfileUpdateDTO(
        userId,
        req.body.name,
        req.body.phone,
        profileImage,
        req.body.address,
        req.body.city,
        req.body.state,
        req.body.pincode
      );

      await this._profileEditUseCase.execute(dto);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.USER.PROFILE_UPDATE_SUCCESS
      });
    } catch (err: any) {
      next(err);
    }
  }
}

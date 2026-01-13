import { Request, Response, NextFunction } from "express";
import { IGetProfileUseCase, IUpdateProfileUseCase, IChangePasswordUseCase } from "../../../application/interface/use-cases/lawyer/IProfileUseCases";
import { UpdateLawyerProfileDTO } from "../../../application/dtos/lawyer/UpdateLawyerProfileDTO";
import { ChangePasswordDTO } from "../../../application/dtos/lawyer/ChangePasswordDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class LawyerProfileController {
  constructor(
    private readonly _getProfileUseCase: IGetProfileUseCase,
    private readonly _updateProfileUseCase: IUpdateProfileUseCase,
    private readonly _changePasswordUseCase: IChangePasswordUseCase
  ) { }

  async getDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          success: false,
          message: MessageConstants.COMMON.UNAUTHORIZED,
        });
      }

      const data = await this._getProfileUseCase.execute(userId);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.LAWYER.FETCH_SUCCESS,
        data,
      });

    } catch (error: any) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          success: false,
          message: MessageConstants.COMMON.UNAUTHORIZED,
        });
      }

      const imageUrl = req.file ? req.file.path : "";

      const dto = new UpdateLawyerProfileDTO(
        req.body.name,
        req.body.phone,
        req.body.address,
        req.body.city,
        req.body.state,
        req.body.pincode,
        imageUrl,
        req.body.bio,
        Number(req.body.consultationFee)
      );

      await this._updateProfileUseCase.execute(userId, dto);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.LAWYER.PROFILE_UPDATE_SUCCESS,
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
        message: MessageConstants.LAWYER.PASSWORD_CHANGE_SUCCESS
      });
    } catch (error: any) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { IGetProfileUseCase, IUpdateProfileUseCase, IChangePasswordUseCase } from "../../../application/interface/use-cases/lawyer/IProfileUseCases";
import { UpdateLawyerProfileDTO } from "../../../application/dtos/lawyer/UpdateLawyerProfileDTO";
import { ChangePasswordDTO } from "../../../application/dtos/lawyer/ChangePasswordDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class LawyerProfileController {
  constructor(
    private readonly _getProfileUseCase: IGetProfileUseCase,
    private readonly _updateProfileUseCase: IUpdateProfileUseCase,
    private readonly _changePasswordUseCase: IChangePasswordUseCase
  ) { }

  async getDetails(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return ApiResponse.error(res, HttpStatusCode.FORBIDDEN, MessageConstants.COMMON.UNAUTHORIZED);
      }

      const data = await this._getProfileUseCase.execute(userId);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.FETCH_SUCCESS, data);

    } catch (error: unknown) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return ApiResponse.error(res, HttpStatusCode.FORBIDDEN, MessageConstants.COMMON.UNAUTHORIZED);
      }

      let imageUrl: string | undefined = undefined;

      if (req.file) {
       
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(req.file.mimetype)) {
          return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, "Invalid file type. Only JPEG, PNG and WEBP are allowed.");
        }

       
        if (req.file.size > 5 * 1024 * 1024) {
          return ApiResponse.error(res, HttpStatusCode.BAD_REQUEST, "File size too large. Maximum 5MB allowed.");
        }

        imageUrl = req.file.path;
      }

      const practiceAreas = req.body.practiceAreas ? (typeof req.body.practiceAreas === 'string' ? JSON.parse(req.body.practiceAreas) : req.body.practiceAreas) : [];
      const languages = req.body.languages ? (typeof req.body.languages === 'string' ? JSON.parse(req.body.languages) : req.body.languages) : [];

      const dto = new UpdateLawyerProfileDTO(
        req.body.name,
        req.body.phone,
        req.body.address,
        req.body.city,
        req.body.state,
        req.body.pincode,
        practiceAreas,
        languages,
        imageUrl,
        req.body.bio,
        req.body.consultationFee ? Number(req.body.consultationFee) : undefined
      );

      await this._updateProfileUseCase.execute(userId, dto);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.PROFILE_UPDATE_SUCCESS);

    } catch (error: unknown) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponse.error(res, HttpStatusCode.FORBIDDEN, MessageConstants.COMMON.UNAUTHORIZED);
      }

      const dto = new ChangePasswordDTO(userId, req.body.oldPassword, req.body.newPassword);

      await this._changePasswordUseCase.execute(dto);

      return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.LAWYER.PASSWORD_CHANGE_SUCCESS);
    } catch (error: unknown) {
      next(error);
    }
  }
}

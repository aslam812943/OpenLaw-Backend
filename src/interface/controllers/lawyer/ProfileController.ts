import { Request, Response } from "express";
import { IGetProfileUseCase, IUpdateProfileUseCase, IChangePasswordUseCase } from "../../../application/useCases/interface/lawyer/IProfileUseCases";
import { UpdateLawyerProfileDTO } from "../../../application/dtos/lawyer/UpdateLawyerProfileDTO";
import { ChangePasswordDTO } from "../../../application/dtos/lawyer/ChangePasswordDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class GetProfileController {
  constructor(
    private readonly _getprofileusecase: IGetProfileUseCase,
    private readonly _updateprofileusecase: IUpdateProfileUseCase,
    private readonly _changepasswordusecase: IChangePasswordUseCase
  ) { }

  // ------------------------------------------
  //   GET PROFILE
  // ------------------------------------------
  async getDetils(req: Request, res: Response) {
    try {
      const id = req.user?.id;

      if (!id) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          success: false,
          message: "Unauthorized: User ID missing",
        });
      }

      const data = await this._getprofileusecase.execute(id);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Profile fetched successfully",
        data,
      });

    } catch (error: any) {


      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch profile. Please try again.",
        error: error.message,
      });
    }
  }

  // ------------------------------------------
  //   UPDATE PROFILE
  // ------------------------------------------
  async updateProfile(req: Request, res: Response) {
    const id = req.user?.id

    if (!id) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        success: false,
        message: "Unauthorized: User ID missing",
      });
    }

    try {
      const imageUrl = req.file ? req.file.path : "";

      const dto = new UpdateLawyerProfileDTO(
        req.body.name,
        req.body.phone,
        req.body.address,
        req.body.city,
        req.body.state,
        req.body.pincode,
        imageUrl,
        req.body.bio
      );

      await this._updateprofileusecase.execute(id, dto);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Profile updated successfully",
      });

    } catch (error: any) {


      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update profile. Please try again.",
        error: error.message,
      });
    }
  }

  // ------------------------------------------
  //   CHANGE PASSWORD
  // ------------------------------------------
  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          success: false,
          message: 'Unauthorized: User ID missing'
        });
      }

      const dto = new ChangePasswordDTO(userId, req.body.oldPassword, req.body.newPassword);

      await this._changepasswordusecase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error: any) {

      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to change password',
      });
    }
  }
}

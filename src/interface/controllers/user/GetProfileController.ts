import { Request, Response } from "express";
import { IGetProfileUseCase, IChangePasswordUseCase,IProfileEditUseCase } from "../../../application/useCases/interface/user/IGetProfileUseCase";
import { ChangePasswordDTO } from "../../../application/dtos/user/ChangePasswordDTO";
import { ProfileUpdateDTO } from "../../../application/dtos/user/ProfileupdateDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
export class GetProfileController {
  constructor(
    private readonly _getprofileusecase: IGetProfileUseCase,
    private readonly _chengepasswordusecase: IChangePasswordUseCase,
    private readonly _profileEditusecase:IProfileEditUseCase
  ) {}

  async getprofiledetils(req: Request, res: Response) {
    try {
      const id = req.user?.id;
          if (!id) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          success: false,
          message: 'Unauthorized: User ID missing'
        });
      }
      const data = await this._getprofileusecase.execute(id);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: 'Profile fetch successful',
        data
      });
    } catch (error: any) {
      

      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to fetch profile details',
        error: error.stack || undefined
      });
    }
  }

  async chengePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          success: false,
          message: 'Unauthorized: User ID missing'
        });
      }

      const dto = new ChangePasswordDTO(userId, req.body.oldPassword, req.body.newPassword);
    
      await this._chengepasswordusecase.execute(dto);

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


async editProfile(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(HttpStatusCode.FORBIDDEN).json({
      success: false,
      message: "Unauthorized: User ID missing",
    });
  }

  try {
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

    await this._profileEditusecase.execute(dto);

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err: any) {


    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message || "An error occurred while updating profile",
    });
  }
}

  
}

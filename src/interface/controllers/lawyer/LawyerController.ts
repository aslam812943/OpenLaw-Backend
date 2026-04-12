import { Request, Response, NextFunction } from "express";
import { VerificationLawyerDTO } from "../../../application/dtos/lawyer/VerificationLawyerDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { IRegisterLawyerUseCase } from "../../../application/interface/use-cases/lawyer/IRegisterLawyerUseCase";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";
import { UnauthorizedError } from "../../../infrastructure/errors/UnauthorizedError";

export class LawyerController {
  constructor(private readonly _registerLawyerUseCase: IRegisterLawyerUseCase) { }

  async registerLawyer(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {

      const documentUrls = Array.isArray(req.files)
        ? (req.files as any[]).map((file) => file.path || file.secure_url || file.url)
        : [];



      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError("User ID missing from secure token");
      }

      const dto = new VerificationLawyerDTO({
        ...req.body,
        userId: userId,
        yearsOfPractice: Number(req.body.yearsOfPractice),
        practiceAreas: typeof req.body.practiceAreas === 'string' ? JSON.parse(req.body.practiceAreas) : req.body.practiceAreas,
        languages: typeof req.body.languages === 'string' ? JSON.parse(req.body.languages) : req.body.languages,
        documentUrls,
      });

      const lawyer = await this._registerLawyerUseCase.execute(dto);


      return ApiResponse.success(res, HttpStatusCode.CREATED, MessageConstants.LAWYER.APPROVE_SUCCESS, lawyer);
    } catch (err: unknown) {
      console.error("Error in lawyer registration:", err);
      next(err);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { VerificationLawyerDTO } from "../../../application/dtos/lawyer/VerificationLawyerDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { IRegisterLawyerUseCase } from "../../../application/interface/use-cases/lawyer/IRegisterLawyerUseCase";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";

export class LawyerController {
  constructor(private readonly _registerLawyerUseCase: IRegisterLawyerUseCase) { }

  async registerLawyer(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const documentUrls = Array.isArray(req.files)
        ? (req.files as Express.Multer.File[]).map((file) => file.path)
        : [];

      const dto = new VerificationLawyerDTO({
        ...req.body,
        userId: JSON.parse(req.body.userId),
        yearsOfPractice: Number(req.body.yearsOfPractice),
        practiceAreas: JSON.parse(req.body.practiceAreas),
        languages: JSON.parse(req.body.languages),
        documentUrls,
      });

      const lawyer = await this._registerLawyerUseCase.execute(dto);

      return ApiResponse.success(res, HttpStatusCode.CREATED, MessageConstants.LAWYER.APPROVE_SUCCESS, lawyer);
    } catch (err: unknown) {
      next(err);
    }
  }
}

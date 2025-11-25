
import { Request, Response } from "express";
import { RegisterLawyerUseCase } from "../../../application/useCases/lawyer/VerificationLawyerUseCase";
import { LawyerRepository } from "../../../infrastructure/repositories/lawyer/LawyerRepository";
import { VerificationLawyerDTO } from "../../../application/dtos/lawyer/VerificationLawyerDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";



export class LawyerController {
  private registerLawyerUseCase: RegisterLawyerUseCase;

  constructor() {

    const repo = new LawyerRepository();
    this.registerLawyerUseCase = new RegisterLawyerUseCase(repo);
  }

  // ------------------------------------------------------------
  // registerLawyer()
  // Handles lawyer verification and registration details.
  // ------------------------------------------------------------


  
  async registerLawyer(req: Request, res: Response) {
    try {

      const documentUrls = Array.isArray(req.files)
        ? req.files.map((file: any) => file.path)
        : [];


      const dto = new VerificationLawyerDTO({
        ...req.body,

        userId: JSON.parse(req.body.userId),
        yearsOfPractice: Number(req.body.yearsOfPractice),
        practiceAreas: JSON.parse(req.body.practiceAreas),
        languages: JSON.parse(req.body.languages),
        documentUrls,
      });




      const lawyer = await this.registerLawyerUseCase.execute(dto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: "Lawyer verification details submitted successfully.",
        lawyer,
      });
    } catch (err: any) {
     


      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: err.message || "Failed to submit lawyer verification details. Please try again.",
      });
    }
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerController = void 0;
const VerificationLawyerUseCase_1 = require("../../../application/useCases/lawyer/VerificationLawyerUseCase");
const LawyerRepository_1 = require("../../../infrastructure/repositories/lawyer/LawyerRepository");
const VerificationLawyerDTO_1 = require("../../../application/dtos/lawyer/VerificationLawyerDTO");
const HttpStatusCode_1 = require("../../../infrastructure/interface/enums/HttpStatusCode");
class LawyerController {
    constructor() {
        const repo = new LawyerRepository_1.LawyerRepository();
        this.registerLawyerUseCase = new VerificationLawyerUseCase_1.RegisterLawyerUseCase(repo);
    }
    // ------------------------------------------------------------
    // registerLawyer()
    // Handles lawyer verification and registration details.
    // ------------------------------------------------------------
    async registerLawyer(req, res, next) {
        try {
            const documentUrls = Array.isArray(req.files)
                ? req.files.map((file) => file.path)
                : [];
            const dto = new VerificationLawyerDTO_1.VerificationLawyerDTO({
                ...req.body,
                userId: JSON.parse(req.body.userId),
                yearsOfPractice: Number(req.body.yearsOfPractice),
                practiceAreas: JSON.parse(req.body.practiceAreas),
                languages: JSON.parse(req.body.languages),
                documentUrls,
            });
            const lawyer = await this.registerLawyerUseCase.execute(dto);
            res.status(HttpStatusCode_1.HttpStatusCode.CREATED).json({
                success: true,
                message: "Lawyer verification details submitted successfully.",
                lawyer,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.LawyerController = LawyerController;
//# sourceMappingURL=lawyerController.js.map
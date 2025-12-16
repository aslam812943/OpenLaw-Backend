"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterLawyerUseCase = void 0;
class RegisterLawyerUseCase {
    constructor(lawyerRepo) {
        this.lawyerRepo = lawyerRepo;
    }
    async execute(data) {
        // Add verification details to the lawyer profile
        return await this.lawyerRepo.addVerificationDetils(data);
    }
}
exports.RegisterLawyerUseCase = RegisterLawyerUseCase;
//# sourceMappingURL=VerificationLawyerUseCase.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNBlockLawyerUseCase = void 0;
class UNBlockLawyerUseCase {
    constructor(_lawyerRepo) {
        this._lawyerRepo = _lawyerRepo;
    }
    async execute(id) {
        // Unblock the lawyer in the repository
        await this._lawyerRepo.unBlockLawyer(id);
    }
}
exports.UNBlockLawyerUseCase = UNBlockLawyerUseCase;
//# sourceMappingURL=UNBlockLawyerUseCase.js.map
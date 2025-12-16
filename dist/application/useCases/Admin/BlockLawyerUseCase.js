"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockLawyerUseCase = void 0;
class BlockLawyerUseCase {
    constructor(_lawyerRepo) {
        this._lawyerRepo = _lawyerRepo;
    }
    async execute(lawyerId) {
        // Block the lawyer in the repository
        await this._lawyerRepo.blockLawyer(lawyerId);
    }
}
exports.BlockLawyerUseCase = BlockLawyerUseCase;
//# sourceMappingURL=BlockLawyerUseCase.js.map
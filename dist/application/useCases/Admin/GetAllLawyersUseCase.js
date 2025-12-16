"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllLawyersUseCase = void 0;
const AdminLawyerMapper_1 = require("../../mapper/admin/AdminLawyerMapper");
class GetAllLawyersUseCase {
    constructor(_lawyerRepo) {
        this._lawyerRepo = _lawyerRepo;
    }
    async execute(query) {
        // Fetch all lawyers from the repository with pagination and search
        const { lawyers, total } = await this._lawyerRepo.findAll(query);
        // Map the lawyers to DTOs
        const lawyerDTOs = AdminLawyerMapper_1.AdminLawyerMapper.toAllLawyerListDTO(lawyers);
        return { lawyers: lawyerDTOs, total };
    }
}
exports.GetAllLawyersUseCase = GetAllLawyersUseCase;
//# sourceMappingURL=GetAllLawyersUseCase.js.map
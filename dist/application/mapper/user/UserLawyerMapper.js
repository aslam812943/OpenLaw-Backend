"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLawyerMapper = void 0;
class UserLawyerMapper {
    static toGetLawyerDTO(lawyer) {
        const dto = {
            id: lawyer.id,
            userId: lawyer.id,
            name: lawyer.name,
            email: lawyer.email,
            phone: String(lawyer.phone ?? '0'),
            yearsOfPractice: lawyer.yearsOfPractice ?? 0,
            practiceAreas: lawyer.practiceAreas ?? [],
            languages: lawyer.languages ?? [],
            profileImage: lawyer.profileImage ?? ''
        };
        return dto;
    }
    static toGetLawyerListDTO(lawyer) {
        return lawyer.map(UserLawyerMapper.toGetLawyerDTO);
    }
}
exports.UserLawyerMapper = UserLawyerMapper;
//# sourceMappingURL=UserLawyerMapper.js.map
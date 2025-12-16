"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLawyerMapper = void 0;
const GetAllLawyerDTO_1 = require("../../dtos/admin/GetAllLawyerDTO");
class AdminLawyerMapper {
    static toAllLawyerDTO(lawyer) {
        const dto = {
            id: lawyer.id,
            name: lawyer.name,
            email: lawyer.email,
            phone: String(lawyer.phone ?? "0"),
            barNumber: lawyer.barNumber ?? "",
            barAdmissionDate: lawyer.barAdmissionDate ?? "",
            yearsOfPractice: lawyer.yearsOfPractice ?? 0,
            practiceAreas: lawyer.practiceAreas || [],
            languages: lawyer.languages || [],
            documentUrls: lawyer.documentUrls || [],
            addressObject: lawyer.addresses
                ? {
                    address: lawyer.addresses.address,
                    city: lawyer.addresses.city,
                    state: lawyer.addresses.state,
                    pincode: lawyer.addresses.pincode,
                }
                : undefined,
            verificationStatus: lawyer.verificationStatus,
            isVerified: lawyer.isVerified,
            isBlock: lawyer.isBlock,
        };
        return new GetAllLawyerDTO_1.GetAllLawyerDTO(dto);
    }
    static toAllLawyerListDTO(lawyers) {
        return lawyers.map(AdminLawyerMapper.toAllLawyerDTO);
    }
}
exports.AdminLawyerMapper = AdminLawyerMapper;
//# sourceMappingURL=AdminLawyerMapper.js.map
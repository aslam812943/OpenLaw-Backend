"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfileMapper = void 0;
const ResponseGetProfileDTO_1 = require("../../dtos/lawyer/ResponseGetProfileDTO");
class GetProfileMapper {
    static toDTO(data) {
        const addressArray = data.addresses
            ? [
                data.addresses.address,
                data.addresses.city,
                data.addresses.state,
                data.addresses.pincode
            ]
            : [];
        const response = new ResponseGetProfileDTO_1.ResponseGetProfileDTO(data.barNumber ?? "", data.barAdmissionDate ?? "", data.yearsOfPractice ?? 0, data.practiceAreas ?? [], data.languages ?? [], data.documentUrls ?? [], addressArray, data.name, data.email, data.phone ?? 0, data.profileImage ?? "", data.bio ?? "", data.isPassword ?? false);
        return response;
    }
}
exports.GetProfileMapper = GetProfileMapper;
//# sourceMappingURL=GetProfileMapper.js.map
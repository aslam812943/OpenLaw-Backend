"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllLawyerDTO = void 0;
class GetAllLawyerDTO {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.barNumber = data.barNumber;
        this.barAdmissionDate = data.barAdmissionDate;
        this.yearsOfPractice = data.yearsOfPractice;
        this.practiceAreas = data.practiceAreas;
        this.languages = data.languages;
        this.documentUrls = data.documentUrls;
        this.addressObject = data.addressObject;
        this.verificationStatus = data.verificationStatus;
        this.isVerified = data.isVerified;
        this.isBlock = data.isBlock;
    }
}
exports.GetAllLawyerDTO = GetAllLawyerDTO;
//# sourceMappingURL=GetAllLawyerDTO.js.map
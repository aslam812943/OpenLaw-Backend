"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseGetSingleLawyerDTO = void 0;
class ResponseGetSingleLawyerDTO {
    constructor(data) {
        this.id = String(data.id);
        this.barNumber = String(data.barNumber);
        this.barAdmissionDate = String(data.barAdmissionDate);
        this.yearsOfPractice = Number(data.yearsOfPractice);
        this.practiceAreas = Array.isArray(data.practiceAreas) ? data.practiceAreas : [];
        this.languages = Array.isArray(data.languages) ? data.languages : [];
        this.address = data.addresses?.address || "";
        this.city = data.addresses?.city || "";
        this.state = data.addresses?.state || "";
        this.name = data.user?.name || "";
        this.email = data.user?.email || "";
        this.phone = String(data.user?.phone || "");
        this.profileImage = data.profileImage || "";
        this.bio = data.bio || "";
    }
}
exports.ResponseGetSingleLawyerDTO = ResponseGetSingleLawyerDTO;
//# sourceMappingURL=ResponseGetSingleLawyerDTO.js.map
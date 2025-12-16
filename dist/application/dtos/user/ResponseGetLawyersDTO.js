"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseGetLawyersDTO = void 0;
class ResponseGetLawyersDTO {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone ?? '';
        this.yearsOfPractice = data.yearsOfPractice;
        this.practiceAreas = data.practiceAreas;
        this.languages = data.languages;
        this.profileImage = data.profileImage ?? '';
    }
}
exports.ResponseGetLawyersDTO = ResponseGetLawyersDTO;
//# sourceMappingURL=ResponseGetLawyersDTO.js.map
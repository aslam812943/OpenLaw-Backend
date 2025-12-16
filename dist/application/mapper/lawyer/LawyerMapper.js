"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerMapper = void 0;
const ResponseGetSingleLawyerDTO_1 = require("../../dtos/user/ResponseGetSingleLawyerDTO");
class LawyerMapper {
    static toSingle(data) {
        return new ResponseGetSingleLawyerDTO_1.ResponseGetSingleLawyerDTO(data);
    }
}
exports.LawyerMapper = LawyerMapper;
//# sourceMappingURL=LawyerMapper.js.map
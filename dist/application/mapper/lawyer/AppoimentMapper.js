"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppoimentMapper = void 0;
const ResponseGetAppoimentsDTO_1 = require("../../dtos/lawyer/ResponseGetAppoimentsDTO");
class AppoimentMapper {
    static toDTO(data) {
        return data.map((b) => {
            return new ResponseGetAppoimentsDTO_1.ResponseGetAppoimnetsDTO(b.id, b.userId, b.date, b.consultationFee, b.startTime, b.endTime, b.status, b.paymentStatus, b.description ?? '', b.userName ?? '');
        });
    }
}
exports.AppoimentMapper = AppoimentMapper;
//# sourceMappingURL=AppoimentMapper.js.map
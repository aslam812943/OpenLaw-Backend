"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserAppointmentsUseCase = void 0;
const userAppoimentsMapper_1 = require("../../mapper/user/userAppoimentsMapper");
class GetUserAppointmentsUseCase {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(userId) {
        let data = await this.bookingRepository.findByUserId(userId);
        return userAppoimentsMapper_1.UserAppointmentsMapper.mapToDto(data);
    }
}
exports.GetUserAppointmentsUseCase = GetUserAppointmentsUseCase;
//# sourceMappingURL=GetUserAppointmentsUseCase.js.map
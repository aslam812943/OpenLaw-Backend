"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityRuleMapper = void 0;
const AvailabilityRule_1 = require("../../../domain/entities/AvailabilityRule");
const ResponseGetAllRuleDTO_1 = require("../../dtos/lawyer/ResponseGetAllRuleDTO");
const ResponseGetALLSlotsDTO_1 = require("../../dtos/user/ResponseGetALLSlotsDTO");
class AvailabilityRuleMapper {
    static toEntity(dto) {
        return new AvailabilityRule_1.AvailabilityRule('', dto.title, dto.startTime, dto.endTime, dto.startDate, dto.endDate, dto.availableDays, dto.bufferTime, dto.slotDuration, dto.maxBookings, dto.sessionType, dto.exceptionDays, dto.lawyerId, dto.consultationFee);
    }
    static toDTO(entity) {
        return new ResponseGetAllRuleDTO_1.GetAvailabilityRuleDTO(entity.id, entity.title, entity.startTime, entity.endTime, entity.startDate, entity.endDate, entity.availableDays, entity.bufferTime, entity.slotDuration, entity.maxBookings, entity.sessionType, entity.exceptionDays, entity.lawyerId, entity.consultationFee);
    }
    static toDTOList(entities) {
        return entities.map((e) => this.toDTO(e));
    }
    static toDTOSlots(data) {
        const slots = data.map((s) => {
            return new ResponseGetALLSlotsDTO_1.ResponseGetALLSlotsDTO(s.id, s.date, s.startTime, s.endTime, s.sessionType, s.isBooked, String(s.consultationFee));
        });
        return slots;
    }
}
exports.AvailabilityRuleMapper = AvailabilityRuleMapper;
//# sourceMappingURL=AvailabilityRuleMapper.js.map
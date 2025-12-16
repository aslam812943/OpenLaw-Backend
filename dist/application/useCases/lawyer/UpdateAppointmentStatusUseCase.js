"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppointmentStatusUseCase = void 0;
const BadRequestError_1 = require("../../../infrastructure/errors/BadRequestError");
class UpdateAppointmentStatusUseCase {
    constructor(_repository) {
        this._repository = _repository;
    }
    async execute(id, status) {
        if (!id || !status) {
            throw new BadRequestError_1.BadRequestError("Appointment ID and status are required.");
        }
        // Update the appointment status in the repository
        await this._repository.updateAppointmentStatus(id, status);
    }
}
exports.UpdateAppointmentStatusUseCase = UpdateAppointmentStatusUseCase;
//# sourceMappingURL=UpdateAppointmentStatusUseCase.js.map
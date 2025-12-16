import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class UpdateAppointmentStatusUseCase {
    constructor(private _repository: IAvailabilityRuleRepository) { }

    async execute(id: string, status: string): Promise<void> {
        if (!id || !status) {
            throw new BadRequestError("Appointment ID and status are required.");
        }
        // Update the appointment status in the repository
        await this._repository.updateAppointmentStatus(id, status);
    }
}

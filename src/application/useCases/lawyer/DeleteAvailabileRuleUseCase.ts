import { IDeleteAvailableRuleUseCase } from "../../interface/use-cases/lawyer/ICreateAvailabilityRuleUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";





export class DeleteAvailableRuleUseCase implements IDeleteAvailableRuleUseCase {
    constructor(private readonly _availabilityRuleRepository: IAvailabilityRuleRepository) { }

    async execute(ruleId: string): Promise<void> {
        try {
            await Promise.all([
                this._availabilityRuleRepository.deleteRuleById(ruleId),
                this._availabilityRuleRepository.deleteSlotsByRuleId(ruleId)
            ]);

            return;

        } catch (err: any) {
            throw new BadRequestError(
                err.message || "Failed to delete availability rule."
            );
        }
    }
}

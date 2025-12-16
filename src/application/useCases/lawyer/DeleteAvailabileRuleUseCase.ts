import { IDeleteAvailableRuleUseCase } from "../../interface/use-cases/lawyer/ICreateAvailabilityRuleUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { AppError } from "../../../infrastructure/errors/AppError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class DeleteAvailableRuleUseCase implements IDeleteAvailableRuleUseCase {

    constructor(private readonly _ruleRepo: IAvailabilityRuleRepository) { }

    async execute(ruleId: string): Promise<void> {

        try {


            await Promise.all([
                this._ruleRepo.deleteRuleById(ruleId),
                this._ruleRepo.deleteSlotsByRuleId(ruleId)
            ]);

            return;

        } catch (err: any) {


            if (err instanceof AppError) throw err;


            throw new BadRequestError(
                err.message || "Failed to delete availability rule."
            );
        }
    }
}

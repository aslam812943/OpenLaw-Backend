import { SlotGeneratorService } from "../../../infrastructure/services/SlotGenerator/SlotGeneratorService";
import { IUpdateAvailabilityRuleUseCase } from "../../interface/use-cases/lawyer/ICreateAvailabilityRuleUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { UpdateAvailabilityRuleDTO } from "../../dtos/lawyer/UpdateAvailabilityRuleDTO";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";



export class UpdateAvailabilityRuleUseCase implements IUpdateAvailabilityRuleUseCase {
  constructor(private readonly _availabilityRuleRepository: IAvailabilityRuleRepository) { }



  async execute(ruleId: string, dto: UpdateAvailabilityRuleDTO): Promise<{ rule: any; slots: any; }> {
    try {
      const updateRule = await this._availabilityRuleRepository.updateRule(ruleId, dto);
      if (!updateRule) throw new NotFoundError("Rule not found");


      await this._availabilityRuleRepository.deleteSlotsByRuleId(ruleId);


      const newSlots = SlotGeneratorService.generateSlots(updateRule);
      if (!newSlots) throw new BadRequestError("Failed to generate slots");


      await this._availabilityRuleRepository.createSlots(ruleId, '', newSlots);

      return {
        rule: updateRule,
        slots: newSlots,
      };
    } catch (error: any) {

      throw new BadRequestError(error.message || "Failed to update rule");
    }
  }
}
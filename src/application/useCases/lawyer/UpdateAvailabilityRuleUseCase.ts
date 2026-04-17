import { IUpdateAvailabilityRuleUseCase } from "../../interface/use-cases/lawyer/ICreateAvailabilityRuleUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { UpdateAvailabilityRuleDTO } from "../../dtos/lawyer/UpdateAvailabilityRuleDTO";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { IGeneratedSlot, ISlotGeneratorService } from "../../interface/services/ISlotGeneratorService";
import { AvailabilityValidator } from "../../utils/AvailabilityValidator";
import { AvailabilityRule } from "../../../domain/entities/AvailabilityRule";
import { Slot } from "../../../domain/entities/Slot";

export class UpdateAvailabilityRuleUseCase implements IUpdateAvailabilityRuleUseCase {
  constructor(
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _slotGeneratorService: ISlotGeneratorService,
    private readonly _lawyerRepository: ILawyerRepository
  ) { }

  async execute(ruleId: string, dto: UpdateAvailabilityRuleDTO): Promise<{ rule: AvailabilityRule; slots: (Slot | IGeneratedSlot)[]; }> {
    try {

      AvailabilityValidator.validate(dto); 


      const existingRule = await this._availabilityRuleRepository.getRuleById(ruleId);
      if (!existingRule) throw new NotFoundError("Rule not found");

      const lawyerId = existingRule.lawyerId.toString();

      const allRules = await this._availabilityRuleRepository.getAllRules(lawyerId);
      const overlapError = AvailabilityValidator.checkOverlaps(dto, allRules, ruleId);
      if (overlapError) {
        throw new BadRequestError(overlapError);
      }


      const updateRule = await this._availabilityRuleRepository.updateRule(ruleId, dto);
      if (!updateRule) throw new NotFoundError("Failed to update rule");


      const bookedSlots = await this._availabilityRuleRepository.getBookedSlotsByRuleId(ruleId);

      await this._availabilityRuleRepository.deleteUnbookedSlotsByRuleId(ruleId);

      const allNewSlots = this._slotGeneratorService.generateSlots(updateRule);

      const filteredSlots = allNewSlots.filter((newSlot: IGeneratedSlot) => {
        const isOverlapping = bookedSlots.some(booked => {
          if (booked.date !== newSlot.date) return false;

          const nStart = AvailabilityValidator.toMinutes(newSlot.startTime);
          const nEnd = AvailabilityValidator.toMinutes(newSlot.endTime);
          const bStart = AvailabilityValidator.toMinutes(booked.startTime);
          const bEnd = AvailabilityValidator.toMinutes(booked.endTime);

          return nStart < bEnd && bStart < nEnd;
        });
        return !isOverlapping;
      });

      if (filteredSlots.length > 0) {
        await this._availabilityRuleRepository.createSlots(ruleId, lawyerId, filteredSlots);
      }

      return {
        rule: updateRule,
        slots: [...bookedSlots, ...filteredSlots],
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestError(error.message);
      }
      throw new BadRequestError("Failed to update rule");
    }
  }
}
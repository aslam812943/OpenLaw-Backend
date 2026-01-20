import { IUpdateAvailabilityRuleUseCase } from "../../interface/use-cases/lawyer/ICreateAvailabilityRuleUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { UpdateAvailabilityRuleDTO } from "../../dtos/lawyer/UpdateAvailabilityRuleDTO";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { IGeneratedSlot, ISlotGeneratorService } from "../../interface/services/ISlotGeneratorService";

import { AvailabilityRule } from "../../../domain/entities/AvailabilityRule";
import { Slot } from "../../../domain/entities/Slot";

export class UpdateAvailabilityRuleUseCase implements IUpdateAvailabilityRuleUseCase {
  constructor(
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _slotGeneratorService: ISlotGeneratorService
  ) { }

  private toMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  async execute(ruleId: string, dto: UpdateAvailabilityRuleDTO): Promise<{ rule: AvailabilityRule; slots: (Slot | IGeneratedSlot)[]; }> {
    try {
      const updateRule = await this._availabilityRuleRepository.updateRule(ruleId, dto);
      if (!updateRule) throw new NotFoundError("Rule not found");

      const bookedSlots = await this._availabilityRuleRepository.getBookedSlotsByRuleId(ruleId);

      await this._availabilityRuleRepository.deleteUnbookedSlotsByRuleId(ruleId);

      const allNewSlots = this._slotGeneratorService.generateSlots(updateRule);

      const filteredSlots = allNewSlots.filter((newSlot: IGeneratedSlot) => {
        const isOverlapping = bookedSlots.some(booked => {
          if (booked.date !== newSlot.date) return false;

          const nStart = this.toMinutes(newSlot.startTime);
          const nEnd = this.toMinutes(newSlot.endTime);
          const bStart = this.toMinutes(booked.startTime);
          const bEnd = this.toMinutes(booked.endTime);

          return nStart < bEnd && bStart < nEnd;
        });
        return !isOverlapping;
      });

      if (filteredSlots.length > 0) {
        await this._availabilityRuleRepository.createSlots(ruleId, updateRule.lawyerId.toString(), filteredSlots);
      }

      return {
        rule: updateRule,
        slots: [...bookedSlots, ...filteredSlots],
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestError(error.message);
      }
      throw new BadRequestError("Failed to update rule");
    }
  }
}
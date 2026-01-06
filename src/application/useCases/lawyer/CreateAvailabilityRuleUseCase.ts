import { ICreateAvailabilityRuleUseCase } from "../../interface/use-cases/lawyer/ICreateAvailabilityRuleUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { AvailabilityRule } from "../../../domain/entities/AvailabilityRule";
import { CreateAvailabilityRuleDTO } from "../../dtos/lawyer/CreateAvailabilityRuleDTO";
import { AvailabilityRuleMapper } from "../../mapper/lawyer/AvailabilityRuleMapper";
import { SlotGeneratorService } from "../../../infrastructure/services/SlotGenerator/SlotGeneratorService";
import { Slot } from "../../../domain/entities/Slot";
import { AppError } from "../../../infrastructure/errors/AppError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class CreateAvailabilityRuleUseCase implements ICreateAvailabilityRuleUseCase {

  constructor(private readonly _repo: IAvailabilityRuleRepository) { }

  private toMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  private async validate(dto: CreateAvailabilityRuleDTO) {
    const errors: string[] = [];

    const startMin = this.toMinutes(dto.startTime);
    const endMin = this.toMinutes(dto.endTime);

   
    if (startMin >= endMin) errors.push("Start time must be before end time.");
    if (Number(dto.slotDuration) < 30 || Number(dto.slotDuration) > 120)
      errors.push("Slot duration must be 30–120 minutes.");
    if (Number(dto.bufferTime) < 5 || Number(dto.bufferTime) > 60)
      errors.push("Buffer time must be 5–60 minutes.");
    if (Number(dto.slotDuration) + Number(dto.bufferTime) > endMin - startMin)
      errors.push("Slot duration + buffer time exceeds total available time.");

    if (dto.startDate > dto.endDate)
      errors.push("Start date must be earlier than end date.");

    if (!dto.availableDays || dto.availableDays.length === 0)
      errors.push("At least one available day is required.");

    if (dto.exceptionDays.length > 0) {
      for (const ex of dto.exceptionDays) {
        if (ex < dto.startDate || ex > dto.endDate) {
          errors.push(`Exception date ${ex} is outside the date range.`);
        }
      }
    }

    const existingRules = await this._repo.getAllRules(dto.lawyerId);

    const newStartDate = new Date(dto.startDate);
    const newEndDate = new Date(dto.endDate);

    for (const rule of existingRules) {
      const ruleStartDate = new Date(rule.startDate);
      const ruleEndDate = new Date(rule.endDate);

      const dateOverlap = newStartDate <= ruleEndDate && newEndDate >= ruleStartDate;

      if (!dateOverlap) continue;

      const dayOverlap = dto.availableDays.some((d) =>
        rule.availableDays.includes(d)
      );

      if (!dayOverlap) continue;

      const ruleStartMin = this.toMinutes(rule.startTime);
      const ruleEndMin = this.toMinutes(rule.endTime);

      const timeOverlap = startMin < ruleEndMin && ruleStartMin < endMin;

      if (timeOverlap) {
        errors.push(
          `Overlapping rule found with "${rule.title}" (${rule.startTime} - ${rule.endTime})`
        );
      }
    }

    if (errors.length > 0) {
      throw new BadRequestError("Validation failed: " + errors.join("; "));
    }
  }

  async execute(dto: CreateAvailabilityRuleDTO): Promise<{ rule: AvailabilityRule; slots: Slot[] }> {

    try {
      if (!dto.lawyerId) {
        throw new BadRequestError("Lawyer ID is missing.");
      }

      await this.validate(dto);

      const newRuleEntity = AvailabilityRuleMapper.toEntity(dto);

      const savedRule = await this._repo.createRule(newRuleEntity);

      if (!savedRule) {
        throw new BadRequestError("Failed to save availability rule.");
      }

      const slots = SlotGeneratorService.generateSlots(newRuleEntity);

      if (!slots || slots.length === 0) {
        throw new BadRequestError("Failed to generate slots.");
      }

      await this._repo.createSlots(savedRule._id.toString(), dto.lawyerId, slots);

      return { rule: savedRule, slots };

    } catch (err: any) {

      if (err instanceof AppError) throw err;

      throw new BadRequestError(
        err.message || "Something went wrong while creating availability rule."
      );
    }
  }
}

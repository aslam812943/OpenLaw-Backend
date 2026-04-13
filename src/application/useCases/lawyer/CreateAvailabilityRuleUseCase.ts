import { ICreateAvailabilityRuleUseCase } from "../../interface/use-cases/lawyer/ICreateAvailabilityRuleUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { AvailabilityRule } from "../../../domain/entities/AvailabilityRule";
import { CreateAvailabilityRuleDTO } from "../../dtos/lawyer/CreateAvailabilityRuleDTO";
import { AvailabilityRuleMapper } from "../../mapper/lawyer/AvailabilityRuleMapper";
import { IGeneratedSlot, ISlotGeneratorService } from "../../interface/services/ISlotGeneratorService";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { AvailabilityValidator } from "../../utils/AvailabilityValidator";

export class CreateAvailabilityRuleUseCase implements ICreateAvailabilityRuleUseCase {

  constructor(
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _slotGeneratorService: ISlotGeneratorService,
    private readonly _lawyerRepository: ILawyerRepository
  ) { }

  async execute(dto: CreateAvailabilityRuleDTO): Promise<{ rule: AvailabilityRule; slots: IGeneratedSlot[] }> {

    try {
      if (!dto.lawyerId) {
        throw new BadRequestError("Lawyer ID is missing.");
      }

  
      AvailabilityValidator.validate(dto);


      const existingRules = await this._availabilityRuleRepository.getAllRules(dto.lawyerId);
      const overlapError = AvailabilityValidator.checkOverlaps(dto, existingRules);
      if (overlapError) {
        throw new BadRequestError(overlapError);
      }

      const newRuleEntity = AvailabilityRuleMapper.toEntity(dto);

      const savedRule = await this._availabilityRuleRepository.createRule(newRuleEntity);

      if (!savedRule) {
        throw new BadRequestError("Failed to save availability rule.");
      }

      const slots = this._slotGeneratorService.generateSlots(newRuleEntity);

      if (!slots || slots.length === 0) {
        throw new BadRequestError("Failed to generate slots.");
      }

      await this._availabilityRuleRepository.createSlots(savedRule.id, dto.lawyerId, slots);

      return { rule: savedRule, slots };

    } catch (err: unknown) {
      if (err instanceof BadRequestError) throw err;
      const error = err as Error;
      throw new BadRequestError(
        error.message || "Something went wrong while creating availability rule."
      );
    }
  }
}

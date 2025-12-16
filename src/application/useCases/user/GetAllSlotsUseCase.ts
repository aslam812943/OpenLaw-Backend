import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { IGetAllSlotsUseCase } from "../../interface/use-cases/user/IGetAllLawyersUseCase";
import { AvailabilityRuleMapper } from "../../mapper/lawyer/AvailabilityRuleMapper";
import { AppError } from "../../../infrastructure/errors/AppError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class GetAllSlotsUseCase implements IGetAllSlotsUseCase {

  constructor(private _slotRepository: IAvailabilityRuleRepository) { }

  async execute(lawyerId: string): Promise<any> {

    if (!lawyerId) {
      throw new BadRequestError("Lawyer ID is required to fetch slots.");
    }

 
    const slots = await this._slotRepository.getAllSlots(lawyerId);


    return AvailabilityRuleMapper.toDTOSlots(slots);

  }
}

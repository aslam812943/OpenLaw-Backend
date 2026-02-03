import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { IGetAllSlotsUseCase } from "../../interface/use-cases/user/IGetAllLawyersUseCase";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { AvailabilityRuleMapper } from "../../mapper/lawyer/AvailabilityRuleMapper";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

import { ResponseGetALLSlotsDTO } from "../../dtos/user/ResponseGetALLSlotsDTO";

export class GetAllSlotsUseCase implements IGetAllSlotsUseCase {

  constructor(
    private _slotRepository: IAvailabilityRuleRepository,
    private _lawyerRepository: ILawyerRepository
  ) { }

  async execute(lawyerId: string): Promise<ResponseGetALLSlotsDTO[]> {

    if (!lawyerId) {
      throw new BadRequestError("Lawyer ID is required to fetch slots.");
    }


    const slots = await this._slotRepository.getAllSlots(lawyerId);
    const lawyer = await this._lawyerRepository.findById(lawyerId);

    if (!lawyer || lawyer.consultationFee === undefined) {
      throw new BadRequestError("Lawyer profile or consultation fee not found.");
    }

    return AvailabilityRuleMapper.toDTOSlots(slots, lawyer.consultationFee);

  }
}

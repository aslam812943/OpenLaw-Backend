import { AvailabilityRule } from "../../../domain/entities/AvailabilityRule";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { IGetAllAvailableRuleUseCase } from "../../interface/use-cases/lawyer/ICreateAvailabilityRuleUseCase";
import { AvailabilityRuleMapper } from "../../mapper/lawyer/AvailabilityRuleMapper";



export class GetAllAvailableRuleUseCase implements IGetAllAvailableRuleUseCase {
    constructor(private readonly _availabilityRuleRepository: IAvailabilityRuleRepository) { }

    async execute(id: string): Promise<AvailabilityRule[]> {
    
        const rules = await this._availabilityRuleRepository.getAllRules(id)

        return AvailabilityRuleMapper.toDTOList(rules)
    }
}
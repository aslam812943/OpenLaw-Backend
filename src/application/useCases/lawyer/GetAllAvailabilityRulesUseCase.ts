import { AvailabilityRule } from "../../../domain/entities/AvailabilityRule";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { IGetAllAvailableRuleUseCase } from "../../interface/use-cases/lawyer/ICreateAvailabilityRuleUseCase";
import { AvailabilityRuleMapper } from "../../mapper/lawyer/AvailabilityRuleMapper";



export class GetAllAvailableRuleUseCase implements IGetAllAvailableRuleUseCase {
    constructor(private readonly _availabilityRuleRepository: IAvailabilityRuleRepository) { }

    async execute(ruleId: string): Promise<AvailabilityRule[]> {
    
        const rules = await this._availabilityRuleRepository.getAllRules(ruleId)

        return AvailabilityRuleMapper.toDTOList(rules)
    }
}
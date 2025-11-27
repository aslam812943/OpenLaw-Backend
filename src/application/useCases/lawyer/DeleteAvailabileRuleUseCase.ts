import { IDeleteAvailableRuleUseCase } from "../interface/lawyer/ICreateAvailabilityRuleUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";



export class DeleteAvailableRuleUseCase implements IDeleteAvailableRuleUseCase{
    constructor(private readonly _ruleRepo:IAvailabilityRuleRepository){}

    async execute(ruleId: string): Promise<void> {
        await this._ruleRepo.deleteRuleById(ruleId)
        await this ._ruleRepo.deleteSlotsByRuleId(ruleId)
        return 
    }
    
}
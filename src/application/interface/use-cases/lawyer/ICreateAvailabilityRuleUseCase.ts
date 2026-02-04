import { CreateAvailabilityRuleDTO } from "../../../dtos/lawyer/CreateAvailabilityRuleDTO";
import { AvailabilityRule } from "../../../../domain/entities/AvailabilityRule";
import { UpdateAvailabilityRuleDTO } from "../../../dtos/lawyer/UpdateAvailabilityRuleDTO";
import { GetAvailabilityRuleDTO } from "../../../dtos/lawyer/ResponseGetAllRuleDTO";
import { Slot } from "../../../../domain/entities/Slot";

import { IGeneratedSlot } from "../../../interface/services/ISlotGeneratorService";

export interface ICreateAvailabilityRuleUseCase {
    execute(dto: CreateAvailabilityRuleDTO): Promise<{ rule: AvailabilityRule; slots: IGeneratedSlot[] }>
}



export interface IUpdateAvailabilityRuleUseCase {
    execute(ruleId: string, dto: UpdateAvailabilityRuleDTO): Promise<{ rule: AvailabilityRule, slots: (Slot | IGeneratedSlot)[] }>
}



export interface IGetAllAvailableRuleUseCase {
    execute(id: string): Promise<GetAvailabilityRuleDTO[]>
}


export interface IDeleteAvailableRuleUseCase {
    execute(ruleId: string): Promise<void>
}


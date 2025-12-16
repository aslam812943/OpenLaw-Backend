import { CreateAvailabilityRuleDTO } from "../../../dtos/lawyer/CreateAvailabilityRuleDTO";
import { AvailabilityRule } from "../../../../domain/entities/AvailabilityRule";
// import { Slot } from "../../../../domain/entities/Slot";
import { UpdateAvailabilityRuleDTO } from "../../../dtos/lawyer/UpdateAvailabilityRuleDTO";


export interface ICreateAvailabilityRuleUseCase{
    execute(dto:CreateAvailabilityRuleDTO):Promise<{rule:AvailabilityRule;slots:any}>
}


export interface IUpdateAvailabilityRuleUseCase{
    execute(ruleId:string,dto:UpdateAvailabilityRuleDTO):Promise<{rule:any,slots:any}>
}


export interface IGetAllAvailableRuleUseCase{
    execute(id:string):Promise<AvailabilityRule[]>
}


export interface IDeleteAvailableRuleUseCase{
    execute(ruleId:string):Promise<void>
}


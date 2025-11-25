import { CreateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/CreateAvailabilityRuleDTO";
import { UpdateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/UpdateAvailabilityRuleDTO";
import { AvailabilityRule } from "../../entities/AvailabilityRule";
export interface IAvailabilityRuleRepository {
    createRule(rule: CreateAvailabilityRuleDTO): Promise<any>;
    updateRule(ruleId: string, updated: UpdateAvailabilityRuleDTO): Promise<any>;
    createSlots(ruleId: string, slots: any[]): Promise<any>;
    deleteSlotsByRuleId(ruleId: string): Promise<void>;
    getRuleById(ruleId: string): Promise<any>;
    getAllRules(id: string): Promise<AvailabilityRule[]>;
    deleteRuleById(ruleId: string): Promise<void>
}
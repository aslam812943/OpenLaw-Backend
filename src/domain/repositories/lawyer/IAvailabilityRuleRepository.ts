import { CreateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/CreateAvailabilityRuleDTO";
import { UpdateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/UpdateAvailabilityRuleDTO";
import { AvailabilityRule } from "../../entities/AvailabilityRule";
import { Slot } from "../../entities/Slot";
import { Booking } from "../../entities/Booking";
export interface IAvailabilityRuleRepository {
    createRule(rule: CreateAvailabilityRuleDTO): Promise<any>;
    updateRule(ruleId: string, updated: UpdateAvailabilityRuleDTO): Promise<any>;
    createSlots(ruleId: string, lawyerId: string, slots: any[]): Promise<any>;
    deleteSlotsByRuleId(ruleId: string): Promise<void>;
    getRuleById(ruleId: string): Promise<any>;
    getAllRules(id: string): Promise<AvailabilityRule[]>;
    deleteRuleById(ruleId: string): Promise<void>
    getAllSlots(lawyerId: string): Promise<Slot[]>
    bookSlot(id: string): Promise<void>
    cancelSlot(startTime: string, lawyerId: string, date: string): Promise<void>
    getAppoiments(lawyerId: string): Promise<Booking[]>
    updateAppointmentStatus(id: string, status: string): Promise<void>;
}
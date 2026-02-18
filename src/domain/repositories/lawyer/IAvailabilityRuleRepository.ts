import { CreateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/CreateAvailabilityRuleDTO";
import { UpdateAvailabilityRuleDTO } from "../../../application/dtos/lawyer/UpdateAvailabilityRuleDTO";
import { AvailabilityRule } from "../../entities/AvailabilityRule";
import { Slot } from "../../entities/Slot";
import { Booking } from "../../entities/Booking";
import { IGeneratedSlot } from "../../../application/interface/services/ISlotGeneratorService";

export interface IAvailabilityRuleRepository {
    createRule(rule: AvailabilityRule): Promise<AvailabilityRule>;
    updateRule(ruleId: string, updated: UpdateAvailabilityRuleDTO): Promise<AvailabilityRule>;
    createSlots(ruleId: string, lawyerId: string, slots: IGeneratedSlot[]): Promise<Slot[]>;
    deleteSlotsByRuleId(ruleId: string): Promise<void>;
    deleteUnbookedSlotsByRuleId(ruleId: string): Promise<void>;
    getBookedSlotsByRuleId(ruleId: string): Promise<Slot[]>;
    getRuleById(ruleId: string): Promise<AvailabilityRule>;
    getAllRules(id: string): Promise<AvailabilityRule[]>;
    deleteRuleById(ruleId: string): Promise<void>
    getAllSlots(lawyerId: string): Promise<Slot[]>
    reserveSlot(id: string, userId: string, durationMinutes?: number): Promise<boolean>
    bookSlot(id: string, userId?: string): Promise<void>;
    findSlotIdByDateTime(lawyerId: string, date: string, startTime: string): Promise<string | null>;
    releaseSlot(id: string): Promise<void>;
    cancelSlot(startTime: string, lawyerId: string, date: string): Promise<void>
    getAppoiments(lawyerId: string): Promise<Booking[]>
    updateAppointmentStatus(id: string, status: string): Promise<void>;
    restrictSlot(id: string, userId: string): Promise<void>;
    getSlotById(id: string): Promise<Slot | null>;
}
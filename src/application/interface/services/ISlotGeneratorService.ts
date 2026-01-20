import { AvailabilityRule } from "../../../domain/entities/AvailabilityRule";

export interface IGeneratedSlot {
    date: string;
    startTime: string;
    endTime: string;
    sessionType: string;
    maxBookings: number;
    consultationFee: number;
}

export interface ISlotGeneratorService {
    generateSlots(rule: AvailabilityRule): IGeneratedSlot[];
}

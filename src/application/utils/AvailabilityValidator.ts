import { BadRequestError } from "../../infrastructure/errors/BadRequestError";

export interface IAvailabilityRuleValidationData {
    title: string;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
    availableDays: string[];
    bufferTime: number;
    slotDuration: number;
    maxBookings: number;
    sessionType: string;
    exceptionDays: string[];
}

export class AvailabilityValidator {
    public static toMinutes(time: string): number {
        if (!time) return 0;


        const ampmMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (ampmMatch) {
            let [_, h, m, ampm] = ampmMatch;
            let hours = parseInt(h, 10);
            const minutes = parseInt(m, 10);
            if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
            if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
            return hours * 60 + minutes;
        }

        const [h, m] = time.split(":").map(Number);
        if (isNaN(h) || isNaN(m)) return 0;
        return h * 60 + m;
    }

    public static validate(data: IAvailabilityRuleValidationData): void {
        const errors: string[] = [];

        // Title validation
        if (!data.title || data.title.trim().length < 4) {
            errors.push("Title is required and must be at least 4 characters.");
        }

        // Time validation
        const startMin = this.toMinutes(data.startTime);
        const endMin = this.toMinutes(data.endTime);

        if (startMin === 0 && data.startTime !== "00:00") {
            errors.push("Invalid start time format.");
        }
        if (endMin === 0 && data.endTime !== "00:00") {
            errors.push("Invalid end time format.");
        }

        if (startMin >= endMin) {
            errors.push("Start time must be before end time.");
        }

        // Duration validation
        if (data.slotDuration < 30 || data.slotDuration > 120) {
            errors.push("Slot duration must be between 30 and 120 minutes.");
        }

        if (data.bufferTime < 5 || data.bufferTime > 60) {
            errors.push("Buffer time must be between 5 and 60 minutes.");
        }

        if (data.slotDuration + data.bufferTime > endMin - startMin) {
            errors.push("Slot duration + buffer time exceeds total available time.");
        }

        // Date validation
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(start.getTime())) errors.push("Invalid start date.");
        if (isNaN(end.getTime())) errors.push("Invalid end date.");

        if (start > end) {
            errors.push("Start date must be earlier than or equal to end date.");
        }

        // Prevent dates too far in the future (e.g., 1 year)
        const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
        if (end.getTime() - start.getTime() > ONE_YEAR_MS) {
            errors.push("Rule duration cannot exceed 1 year.");
        }

        // Days validation
        if (!data.availableDays || data.availableDays.length === 0) {
            errors.push("At least one available day is required.");
        }

        const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (const day of data.availableDays) {
            if (!validDays.includes(day)) {
                errors.push(`Invalid day: ${day}.`);
            }
        }

        // Session type validation
        if (data.sessionType !== "Online Video Call") {
            errors.push("Currently only 'Online Video Call' is supported.");
        }

        // Max bookings validation
        if (data.maxBookings !== 1) {
            errors.push("Max bookings must be 1.");
        }

        // Exception days validation
        if (data.exceptionDays && data.exceptionDays.length > 0) {
            for (const ex of data.exceptionDays) {
                const exDate = new Date(ex);
                if (isNaN(exDate.getTime())) {
                    errors.push(`Invalid exception date: ${ex}.`);
                    continue;
                }
                if (exDate < start || exDate > end) {
                    errors.push(`Exception date ${ex} is outside the rule's date range.`);
                }
            }
        }

        if (errors.length > 0) {
            throw new BadRequestError("Validation failed: " + errors.join("; "));
        }
    }

    public static checkOverlaps(
        newData: { startTime: string; endTime: string; startDate: string; endDate: string; availableDays: string[] },
        existingRules: any[],
        excludeRuleId?: string
    ): string | null {
        const newStartMin = this.toMinutes(newData.startTime);
        const newEndMin = this.toMinutes(newData.endTime);
        const newStartDate = new Date(newData.startDate);
        const newEndDate = new Date(newData.endDate);

        for (const rule of existingRules) {
            if (excludeRuleId && (rule.id === excludeRuleId || rule._id?.toString() === excludeRuleId)) {
                continue;
            }

            const ruleStartDate = new Date(rule.startDate);
            const ruleEndDate = new Date(rule.endDate);

            // Check date range overlap
            const dateOverlap = newStartDate <= ruleEndDate && newEndDate >= ruleStartDate;
            if (!dateOverlap) continue;

            // Check day overlap
            const dayOverlap = newData.availableDays.some((d) =>
                rule.availableDays.includes(d)
            );
            if (!dayOverlap) continue;

            // Check time overlap
            const ruleStartMin = this.toMinutes(rule.startTime);
            const ruleEndMin = this.toMinutes(rule.endTime);

            const timeOverlap = newStartMin < ruleEndMin && ruleStartMin < newEndMin;
            if (timeOverlap) {
                return `Overlapping rule found: "${rule.title}" (${rule.startTime}-${rule.endTime})`;
            }
        }

        return null;
    }
}

import { AvailabilityRule } from "../../../domain/entities/AvailabilityRule";
import { IGeneratedSlot, ISlotGeneratorService } from "../../../application/interface/services/ISlotGeneratorService";

export class SlotGeneratorService implements ISlotGeneratorService {
  generateSlots(rule: AvailabilityRule): IGeneratedSlot[] {
    const slots: IGeneratedSlot[] = [];

    let startDate = new Date(rule.startDate);
    const endDate = new Date(rule.endDate);

    const slotDuration = Number(rule.slotDuration);
    const bufferTime = Number(rule.bufferTime);
    const maxBookings = Number(rule.maxBookings);

    while (startDate <= endDate) {
      const dayName = startDate.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = startDate.toISOString().split("T")[0];

      if (
        rule.availableDays.includes(dayName) &&
        !rule.exceptionDays.includes(dateStr)
      ) {
        const dayStartTime = new Date(`${dateStr}T${rule.startTime}:00`);
        const dayEndTime = new Date(`${dateStr}T${rule.endTime}:00`);

        let currentStart = new Date(dayStartTime);

        while (currentStart < dayEndTime) {
          const nextSlot = new Date(currentStart.getTime() + slotDuration * 60000);

          if (nextSlot > dayEndTime) break;

          slots.push({
            date: dateStr,
            startTime: currentStart.toTimeString().slice(0, 5),
            endTime: nextSlot.toTimeString().slice(0, 5),
            sessionType: rule.sessionType,
            maxBookings: maxBookings,
            consultationFee: rule.consultationFee
          });

          currentStart = new Date(
            currentStart.getTime() + (slotDuration + bufferTime) * 60000
          );
        }
      }

      startDate.setDate(startDate.getDate() + 1);
    }

    return slots;
  }
}

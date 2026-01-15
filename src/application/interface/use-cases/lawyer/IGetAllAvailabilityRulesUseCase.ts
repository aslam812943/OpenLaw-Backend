import { AvailabilityRule } from "../../../../domain/entities/AvailabilityRule";

export interface IGetAllAvailabilityRulesUseCase {
    execute(lawyerId: string): Promise<AvailabilityRule[]>;
}

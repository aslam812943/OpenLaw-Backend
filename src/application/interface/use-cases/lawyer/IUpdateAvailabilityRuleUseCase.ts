import { UpdateAvailabilityRuleDTO } from "../../../dtos/lawyer/UpdateAvailabilityRuleDTO";

export interface IUpdateAvailabilityRuleUseCase {
    execute(lawyerId: string, ruleId: string, data: UpdateAvailabilityRuleDTO): Promise<void>;
}

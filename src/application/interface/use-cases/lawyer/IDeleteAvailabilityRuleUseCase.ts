export interface IDeleteAvailabilityRuleUseCase {
    execute(lawyerId: string, ruleId: string): Promise<void>;
}

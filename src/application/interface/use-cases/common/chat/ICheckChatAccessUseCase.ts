

export interface ICheckChatAccessUseCase {
    execute(userId: string, lawyerId: string): Promise<{hasAccess: boolean }>;
}

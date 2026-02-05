export class Notification {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly message: string,
        public readonly type: string,
        public readonly isRead: boolean,
        public readonly createdAt: Date,
        public readonly metadata?: Record<string, unknown>
    ) { }
}

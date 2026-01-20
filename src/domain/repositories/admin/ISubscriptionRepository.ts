import { Subscription } from "../../entities/Subscription"
export interface ISubscriptionRepository {
    create(data: Subscription): Promise<void>
    // findAll(): Promise<any[]>
    findAllSubscription(page: number, limit: number): Promise<{ plans: Subscription[], total: number }>
    findActive(): Promise<Subscription[]>
    toggleStatus(id: string, status: boolean): Promise<void>
    update(id: string, data: Partial<Subscription>): Promise<void>
    findById(id: string): Promise<Subscription | null>
    findByName(name: string): Promise<Subscription | null>
}
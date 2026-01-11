import { Subscription } from "../../../domain/entities/Subscription";
import { SubscriptionDTO } from "../../dtos/lawyer/SubscriptionDTO";

export class SubscriptionMapper {
    static toDTO(subscription: Subscription, expiryDate?: Date): SubscriptionDTO {
        return new SubscriptionDTO(
            subscription.id,
            subscription.planName,
            subscription.duration,
            subscription.durationUnit,
            subscription.price,
            subscription.commissionPercent,
            subscription.isActive,
            expiryDate
        );
    }

    static toDTOs(subscriptions: Subscription[]): SubscriptionDTO[] {
        return subscriptions.map(subscription => this.toDTO(subscription));
    }
}

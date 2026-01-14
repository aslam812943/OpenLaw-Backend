import { UpdateSubscriptionDTO } from "../../../dtos/admin/UpdateSubscriptionDTO";

export interface IUpdateSubscriptionUseCase {
    execute(data: UpdateSubscriptionDTO): Promise<void>;
}

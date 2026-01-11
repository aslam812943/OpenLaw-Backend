import { SubscriptionDTO } from "../../../dtos/lawyer/SubscriptionDTO" 
 
 export interface IGetCurrentSubscriptionUseCase{
    execute(lawyerId:string):Promise<SubscriptionDTO|null>
 }
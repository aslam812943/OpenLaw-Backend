import { IReviewRepository } from "../../../../../domain/repositories/IReviewRepository";
import { GetAllReviewDTO } from "../../../../dtos/user/review/GetAllReviewDTO";


export interface IGetAllReviewsUseCase {
    execute(lawyerId: string): Promise<GetAllReviewDTO[]>
}
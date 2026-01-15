import { IGetAllReviewsUseCase } from "../../../interface/use-cases/user/review/IGetAllReviewsUsecase";
import { IReviewRepository } from "../../../../domain/repositories/IReviewRepository";
import { ReviewMapper } from "../../../mapper/user/ReviewMapper";
import { GetAllReviewDTO } from "../../../dtos/user/review/GetAllReviewDTO";

export class GetAllReviewsUseCase implements IGetAllReviewsUseCase {
   constructor(private _reviewRepository: IReviewRepository) { }
   async execute(lawyerId: string): Promise<GetAllReviewDTO[]> {
      let data = await this._reviewRepository.findAll(lawyerId)
      return ReviewMapper.toDto(data);
   }
}
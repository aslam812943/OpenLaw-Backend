import { IGetAllReviewsUseCase } from "../../../interface/use-cases/user/review/IGetAllReviewsUsecase";
import { IReviewRepository } from "../../../../domain/repositories/IReviewRepository";
import { ReviewMapper } from "../../../mapper/user/ReviewMapper";
import { GetAllReviewDTO } from "../../../dtos/user/review/GetAllReviewDTO";

export class GetAllReviewsUseCase implements IGetAllReviewsUseCase {
   constructor(private reviewRepo: IReviewRepository) { }
   async execute(lawyerId: string): Promise<GetAllReviewDTO[]> {
      let data = await this.reviewRepo.findAll(lawyerId)
      return ReviewMapper.toDto(data);
   }
}
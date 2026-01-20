import { Response, Request, NextFunction } from "express";
import { IGetAllLawyersUseCase } from "../../../application/interface/use-cases/user/IGetAllLawyersUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

export class GetAllLawyersController {
   constructor(private readonly _getAllLawyersUseCase: IGetAllLawyersUseCase) { }

   async getAllLawyers(req: Request, res: Response, next: NextFunction) {
      try {
         const page = Number(req.query.page) || 1;
         const limit = Number(req.query.limit) || 10;
         const search = String(req.query.search || "");
         const sort = String(req.query.sort || "");
         const practiceArea = String(req.query.practiceArea || "");

         const result = await this._getAllLawyersUseCase.execute({
            page,
            limit,
            search,
            sort,
            filter: practiceArea,
            fromAdmin: false
         });

         return res.status(HttpStatusCode.OK).json({
            success: true,
            message: MessageConstants.LAWYER.FETCH_SUCCESS,
            data: {
               lawyers: result.lawyers,
               totalCount: result.total,
               currentPage: page,
               totalPages: Math.ceil(result.total / limit)
            }
         });
      } catch (error: unknown) {
         next(error);
      }
   }
}

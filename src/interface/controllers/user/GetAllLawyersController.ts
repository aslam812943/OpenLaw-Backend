import { Response, Request, NextFunction } from "express";
import { IGetAllLawyersUseCase } from "../../../application/interface/use-cases/admin/IGetAllLawyersUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

export class GetAllLawyersController {
   constructor(private _getallLawyersUseCase: IGetAllLawyersUseCase) { }

   async GetAllLawyers(req: Request, res: Response, next: NextFunction) {
      try {

         const page = Number(req.query.page) || 1;
         const limit = Number(req.query.limit) || 10;
         const search = String(req.query.search || "");
         const sort = String(req.query.sort || "");
         const filter = String(req.query.practiceArea || "");



         const response = await this._getallLawyersUseCase.execute({
            page,
            limit,
            search,
            sort,
            filter,
            fromAdmin: false
         });

       

         return res.status(HttpStatusCode.OK).json({
            success: true,
            message: "Lawyers fetched successfully.",
            response: {
               lawyers: response.lawyers,
               totalCount: response.total,
               currentPage: page,
               totalPages: Math.ceil(response.total / limit)
            }
         });

      } catch (error: any) {

         next(error)
      }
   }
}

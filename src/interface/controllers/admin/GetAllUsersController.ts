import { Response, Request, NextFunction } from "express";
import { IGetAllUsersUseCase } from "../../../application/interface/use-cases/admin/IGetAllUsersUseCase";
import { GetAllUserDTO } from "../../../application/dtos/admin/GetAllUserDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";

interface PaginationInput {
  page: number;
  limit: number;
  search?: string;
  filter?: string;
  sort?: string;
}

export class GetAllUsersController {
  constructor(private readonly _getAllUserUseCase: IGetAllUsersUseCase<PaginationInput,{ users: GetAllUserDTO[]; total: number }>) { }

  async handle(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const search = req.query.search as string;
      const filter = req.query.filter as string;
      const sort = req.query.sort as string;

      const { users, total } = await this._getAllUserUseCase.execute({ page, limit, search, filter, sort });

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: MessageConstants.USER.FETCH_SUCCESS,
        users,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });

    } catch (err: any) {
      next(err);
    }
  }
}

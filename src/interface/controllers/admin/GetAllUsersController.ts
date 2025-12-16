
import { Response, Request } from "express";
import { IGetAllUsersUseCase } from "../../../application/interface/use-cases/admin/IGetAllUsersUseCase";
import { GetAllUserDTO } from "../../../application/dtos/admin/GetAllUserDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

interface PaginationInput {
  page: number;
  limit: number;
}

//  GetAllUsersController

export class GetAllUsersController {
  constructor(
    private _getAllUserUseCase: IGetAllUsersUseCase<
      PaginationInput,
      { users: GetAllUserDTO[]; total: number }
    >
  ) { }


  async handle(req: Request, res: Response, next: any): Promise<Response | void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { users, total } = await this._getAllUserUseCase.execute({ page, limit });

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Users fetched successfully.",
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

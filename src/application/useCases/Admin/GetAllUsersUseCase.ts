import { IGetAllUsersUseCase } from "../../interface/use-cases/admin/IGetAllUsersUseCase";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { GetAllUserDTO } from "../../dtos/admin/GetAllUserDTO";
import { AdminUserMapper } from "../../mapper/admin/AdminUserMapper";

interface PaginationInput {
  page: number;
  limit: number;
}

export class GetAllUsersUseCase
  implements IGetAllUsersUseCase<PaginationInput, { users: GetAllUserDTO[]; total: number }> {
  constructor(private _userRepository: IUserRepository) { }

  async execute(query: PaginationInput & { search?: string; filter?: string; sort?: string }): Promise<{ users: GetAllUserDTO[]; total: number }> {
    const { users, total } = await this._userRepository.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      filter: query.filter,
      sort: query.sort
    });
    const userDTOs = AdminUserMapper.toUserSummaryListDTO(users);
    return { users: userDTOs, total };
  }
}

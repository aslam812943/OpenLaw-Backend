import { IGetAllUsersUseCase } from "../../interface/use-cases/admin/IGetAllUsersUseCase";
import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { GetAllUserDTO } from "../../dtos/admin/GetAllUserDTO";
import { AdminUserMapper } from "../../mapper/admin/AdminUserMapper";

interface PaginationInput {
  page: number;
  limit: number;
}

export class GetAllUsersUseCase
  implements IGetAllUsersUseCase<PaginationInput, { users: GetAllUserDTO[]; total: number }> {
  constructor(private _userRepo: IUserRepository) { }

  async execute({ page, limit }: PaginationInput): Promise<{ users: GetAllUserDTO[]; total: number }> {
    const { users, total } = await this._userRepo.findAll(page, limit);
    const userDTOs = AdminUserMapper.toUserSummaryListDTO(users);
    return { users: userDTOs, total };
  }
}

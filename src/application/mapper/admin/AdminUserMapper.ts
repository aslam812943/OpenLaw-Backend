import { User } from "../../../domain/entities/User";
import { GetAllUserDTO, IGetAllUserDTO } from "../../dtos/admin/GetAllUserDTO";

export class AdminUserMapper {
  static toUserSummaryDTO(user: User): GetAllUserDTO {
    const dto: IGetAllUserDTO = {
      _id: user.id ? user.id.toString() : "",
      name: user.name,
      email: user.email,
      phone: user.phone.toString(),
      isBlock: user.isBlock,
    };
    return new GetAllUserDTO(dto);
  }

  static toUserSummaryListDTO(users: User[]): GetAllUserDTO[] {
    return users.map((user) => this.toUserSummaryDTO(user));
  }
}

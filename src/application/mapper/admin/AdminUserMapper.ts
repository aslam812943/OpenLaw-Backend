import {User} from '../../../domain/entities/ User'
import { GetAllUserDTO,IGetAllUserDTO } from '../../dtos/admin/GetAllUserDTO'


export class AdminUserMapper{
   static toUserSummaryDTO(user: User): GetAllUserDTO {
    const dto: IGetAllUserDTO = {
      id: user.id!,
      name: user.name,
      email: user.email,
      phone: user.phone.toString(),
      isBlock:false
    //   role: user.role,
    //   isVerified: user.isVerified,
    //   hasSubmittedVerification: user.hasSubmittedVerification,
    }
    return new GetAllUserDTO(dto);
  };

  // convenience: array mapping
  static toUserSummaryListDTO(users: User[]): GetAllUserDTO[] {
    return users.map(AdminUserMapper.toUserSummaryDTO);
  }  
}
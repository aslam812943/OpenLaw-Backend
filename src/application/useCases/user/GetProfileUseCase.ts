import { IGetProfileUseCase } from "../interface/user/IGetProfileUseCase";
import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { ResponseGetProfileDTO } from "../../dtos/user/ResponseGetProfileDTO";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(private readonly _repo: IUserRepository) {}

  async execute(id: string): Promise<ResponseGetProfileDTO> {
    const data = await this._repo.findById(id);
    if (!data) throw new Error(`User profile data not found for id: ${id}`);

    const userdto = new ResponseGetProfileDTO(
      data.id ?? '',
      data.name,
      data.email,
      data.phone.toString(),
      data.profileImage??'',
      data.address??{}


    );

    return userdto;
  }
}

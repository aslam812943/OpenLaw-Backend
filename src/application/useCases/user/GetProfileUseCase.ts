import { IGetProfileUseCase } from "../../interface/use-cases/user/IGetProfileUseCase";
import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { ResponseGetProfileDTO } from "../../dtos/user/ResponseGetProfileDTO";
import { AppError } from "../../../infrastructure/errors/AppError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(private readonly _repo: IUserRepository) { }

  async execute(id: string): Promise<ResponseGetProfileDTO> {


    if (!id) {
      throw new BadRequestError("User ID is required to fetch profile.");
    }

    
    const data = await this._repo.findById(id);

    if (!data) {
      throw new NotFoundError(`User not found for ID: ${id}`);
    }

    const userDTO = new ResponseGetProfileDTO(
      data.id ?? "",
      data.name ?? "",
      data.email ?? "",
      data.phone ? String(data.phone) : "",
      data.profileImage ?? "",
      data.address ?? {},
      data.isPassword ?? true
    );

    return userDTO;
  }
}

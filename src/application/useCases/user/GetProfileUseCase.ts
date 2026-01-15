import { IGetProfileUseCase } from "../../interface/use-cases/user/IGetProfileUseCase";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { ResponseGetProfileDTO } from "../../dtos/user/ResponseGetProfileDTO";
import { AppError } from "../../../infrastructure/errors/AppError";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(private readonly _userRepository: IUserRepository) { }

  async execute(userId: string): Promise<ResponseGetProfileDTO> {


    if (!userId) {
      throw new BadRequestError("User ID is required to fetch profile.");
    }


    const data = await this._userRepository.findById(userId);

    if (!data) {
      throw new NotFoundError(`User not found for ID: ${userId}`);
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

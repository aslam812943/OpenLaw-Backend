
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { GetAllLawyerDTO } from "../../dtos/admin/GetAllLawyerDTO";
import { AdminLawyerMapper } from "../../mapper/admin/AdminLawyerMapper";
import { IGetAllLawyersUseCase } from "../../interface/use-cases/admin/IGetAllLawyersUseCase";

export class GetAllLawyersUseCase implements IGetAllLawyersUseCase {
  constructor(private _lawyerRepo: ILawyerRepository) { }

  async execute(query?: { page?: number; limit?: number; search?: string; fromAdmin?: boolean }): Promise<{ lawyers: GetAllLawyerDTO[]; total: number }> {
    // Fetch all lawyers from the repository with pagination and search
    const { lawyers, total } = await this._lawyerRepo.findAll(query);
    // Map the lawyers to DTOs
    const lawyerDTOs = AdminLawyerMapper.toAllLawyerListDTO(lawyers);
    return { lawyers: lawyerDTOs, total };
  }
}

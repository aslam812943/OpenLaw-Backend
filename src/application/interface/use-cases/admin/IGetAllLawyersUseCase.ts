import { IUseCase } from "../common/IUseCase";
import { GetAllLawyerDTO } from "../../../dtos/admin/GetAllLawyerDTO";

export interface IGetAllLawyersUseCase
  extends IUseCase<{ page?: number; limit?: number; sort?: string; filter?: string; search?: string; fromAdmin?: boolean }, { lawyers: GetAllLawyerDTO[]; total: number }> { }
import { Lawyer } from "../../entities/Lawyer";
import { VerificationLawyerDTO } from "../../../application/dtos/lawyer/VerificationLawyerDTO";
import { UpdateLawyerProfileDTO } from "../../../application/dtos/lawyer/UpdateLawyerProfileDTO";
export interface ILawyerRepository {
  createLawyer(lawyer: VerificationLawyerDTO): Promise<Lawyer>;
  findAll(query?: { page?: number; limit?: number; search?: string }): Promise<{ lawyers: Lawyer[]; total: number }>;
  blockLawyer(id: string): Promise<void>;
  unBlockLawyer(id: string): Promise<void>;
  approveLawyer(id: string): Promise<void>;
  rejectLawyer(id: string): Promise<void>;
  findById(id: string): Promise<Lawyer>;
  updateProfile(id: string, dto: UpdateLawyerProfileDTO): Promise<void>

}

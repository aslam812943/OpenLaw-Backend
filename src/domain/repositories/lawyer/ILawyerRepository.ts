import { Lawyer } from "../../entities/Lawyer";
import { VerificationLawyerDTO } from "../../../application/dtos/lawyer/VerificationLawyerDTO";
import { UpdateLawyerProfileDTO } from "../../../application/dtos/lawyer/UpdateLawyerProfileDTO";
export interface ILawyerRepository {
  addVerificationDetils(lawyer: VerificationLawyerDTO): Promise<Lawyer>;
  create(lawyer: Partial<Lawyer>): Promise<Lawyer>;
  findByEmail(email: string): Promise<any>;
  findAll(query?: { page?: number; limit?: number; search?: string; fromAdmin?: boolean; }): Promise<{ lawyers: Lawyer[]; total: number }>;
  blockLawyer(id: string): Promise<void>;
  unBlockLawyer(id: string): Promise<void>;
  approveLawyer(id: string): Promise<void>;
  rejectLawyer(id: string): Promise<void>;
  findById(id: string): Promise<Lawyer>;
  updateProfile(id: string, dto: UpdateLawyerProfileDTO): Promise<void>
  changePassword(id: string, oldPass: string, newPass: string): Promise<void>
  forgotpassword(id: string, password: string): Promise<void>
  // getSingleLawyer(id: string): Promise<Lawyer>;
  // findOne(userId: string): Promise<string | null>
  updateGoogleId(id: string, googleId: string): Promise<void>;
  updateSubscriptionStatus(id: string, subscriptionId: string, paymentVerified: boolean): Promise<void>;
  updateWalletBalance(lawyerId: string, amount: number): Promise<void>;
}

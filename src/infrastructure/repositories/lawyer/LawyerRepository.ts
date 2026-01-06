
import LawyerModel, { ILawyerDocument } from "../../db/models/LawyerModel";

import { VerificationLawyerDTO } from "../../../application/dtos/lawyer/VerificationLawyerDTO";
import { Lawyer } from "../../../domain/entities/Lawyer";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";

import { UpdateLawyerProfileDTO } from "../../../application/dtos/lawyer/UpdateLawyerProfileDTO";
import bcrypt from "bcrypt";
import { ConflictError } from "../../errors/ConflictError";
import { InternalServerError } from "../../errors/InternalServerError";
import { NotFoundError } from "../../errors/NotFoundError";


//  LawyerRepository

export class LawyerRepository implements ILawyerRepository {

  constructor() { }

  // ------------------------------------------------------------
  //  create() - For initial registration
  // ------------------------------------------------------------
  async create(lawyer: Partial<Lawyer>): Promise<Lawyer> {
    try {
      const lawyerDoc = await LawyerModel.create(lawyer);
      return this.mapToDomain(lawyerDoc);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictError("A lawyer with this email already exists.");
      }
      throw new InternalServerError("Database error while creating lawyer.");
    }
  }

  // ------------------------------------------------------------
  //  findByEmail()
  // ------------------------------------------------------------
  async findByEmail(email: string): Promise<Lawyer | null> {
    try {
      const lawyerDoc = await LawyerModel.findOne({ email });

      if (!lawyerDoc) return null;
      return this.mapToDomain(lawyerDoc);
    } catch (error: any) {

      throw new InternalServerError("Database error while fetching lawyer by email.");
    }
  }

  // ------------------------------------------------------------
  //  addVerificationDetils() - For submitting verification details
  // ------------------------------------------------------------
  async addVerificationDetils(lawyer: VerificationLawyerDTO): Promise<Lawyer> {
    try {

      const lawyerDoc = await LawyerModel.findByIdAndUpdate(
        lawyer.userId,
        {
          barNumber: lawyer.barNumber,
          barAdmissionDate: lawyer.barAdmissionDate,
          yearsOfPractice: lawyer.yearsOfPractice,
          practiceAreas: lawyer.practiceAreas,
          languages: lawyer.languages,
          documentUrls: lawyer.documentUrls,
          hasSubmittedVerification: true,
          verificationStatus: 'pending',
          isAdminVerified: false
        },
        { new: true }
      );

      if (!lawyerDoc) throw new Error("Lawyer not found for verification submission.");

      return this.mapToDomain(lawyerDoc);
    } catch (error: any) {
      throw new InternalServerError("Database error while updating lawyer verification details.");
    }
  }

  // ------------------------------------------------------------
  //  findAll()
  // ------------------------------------------------------------
  async findAll(query?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    filter?: string;
    fromAdmin?: boolean;
  }): Promise<{ lawyers: Lawyer[]; total: number }> {
    try {
      const page = Math.max(Number(query?.page) || 1, 1);
      const limit = Math.max(Number(query?.limit) || 10, 1);
      const search = query?.search?.trim();
      const sort = query?.sort;
      const filter = query?.filter?.trim();

      const andConditions: any[] = [];


      if (search) {
        andConditions.push({
          $or: [
            { practiceAreas: { $regex: search, $options: "i" } },
            { languages: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        });
      }


      if (filter) {
        andConditions.push({
          practiceAreas: { $regex: filter, $options: "i" },
        });
      }


      if (!query?.fromAdmin) {
        andConditions.push(
          { isBlock: false },
          { isAdminVerified: true },
          { paymentVerify: true },
          { isVerified: true },
          { verificationStatus: "Approved" },
          { bio: { $exists: true, $ne: "" } }
        );
      }

      const match = andConditions.length ? { $and: andConditions } : {};


      const sortOption: any = {};
      switch (sort) {
        case "experience-asc":
          sortOption.yearsOfPractice = 1;
          break;
        case "experience-desc":
          sortOption.yearsOfPractice = -1;
          break;
        default:
          sortOption._id = -1;
      }

      const [lawyerDocs, total] = await Promise.all([
        LawyerModel.find(match)
          .sort(sortOption)
          .skip((page - 1) * limit)
          .limit(limit)
          .exec(),
        LawyerModel.countDocuments(match),
      ]);

      return {
        lawyers: lawyerDocs.map((doc) => this.mapToDomain(doc)),
        total,
      };
    } catch (error) {
      throw new InternalServerError("Database error while fetching lawyers.");
    }
  }


  // ------------------------------------------------------------
  //  blockLawyer()
  // ------------------------------------------------------------
  async blockLawyer(id: string): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(id, { isBlock: true });
    } catch (error: any) {
      throw new InternalServerError("Database error while blocking lawyer.");
    }
  }

  // ------------------------------------------------------------
  //  unBlockLawyer()
  // ------------------------------------------------------------
  async unBlockLawyer(id: string): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(id, { isBlock: false });
    } catch (error: any) {
      throw new InternalServerError("Database error while unblocking lawyer.");
    }
  }

  // ------------------------------------------------------------
  //  approveLawyer()
  // ------------------------------------------------------------
  async approveLawyer(id: string): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(id, {
        isAdminVerified: true,
        verificationStatus: "Approved"
      });
    } catch (error: any) {
      throw new InternalServerError("Database error while approving lawyer.");
    }
  }

  // ------------------------------------------------------------
  //  rejectLawyer()
  // ------------------------------------------------------------
  async rejectLawyer(id: string): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(id, {
        isAdminVerified: false,
        verificationStatus: "Rejected"
      });
    } catch (error: any) {
      throw new InternalServerError("Database error while rejecting lawyer.");
    }
  }

  // ------------------------------------------------------------
  //  findById()
  // ------------------------------------------------------------
  async findById(id: string): Promise<Lawyer> {
    try {
      if (!id) throw new Error("Invalid ID: ID not provided");
      const doc = await LawyerModel.findById(id);
      if (!doc) throw new Error(`Lawyer with ID ${id} not found`);
      return this.mapToDomain(doc);
    } catch (error: any) {
      throw new InternalServerError(error.message || "Database error while fetching lawyer profile.");
    }
  }

  // ------------------------------------------------------------
  //  updateProfile()
  // ------------------------------------------------------------
  async updateProfile(id: string, dto: UpdateLawyerProfileDTO): Promise<void> {
    try {
      if (!id) throw new Error("Invalid ID: ID not provided");

      const data = await LawyerModel.findById(id);
      if (!data) throw new Error(`Lawyer with ID ${id} not found`);

      if (!data.Address) {
        data.Address = { address: "", city: "", state: "", pincode: 0 };
      }

      if (dto.imageUrl) data.Profileimageurl = dto.imageUrl;
      data.name = dto.name;
      data.phone = Number(dto.phone);

      data.Address.address = dto.address;
      data.Address.city = dto.city;
      data.Address.state = dto.state;
      data.Address.pincode = Number(dto.pincode);
      if (dto.bio) data.bio = dto.bio;
      if (dto.consultationFee !== undefined) data.consultationFee = dto.consultationFee;
      data.isVerified = true;

      await data.save();
    } catch (error: any) {
      throw new InternalServerError(error.message || "Database error while updating lawyer profile.");
    }
  }

  // ------------------------------------------------------------
  //  changePassword()
  // ------------------------------------------------------------
  async changePassword(id: string, oldPass: string, newPass: string): Promise<void> {
    try {
      const lawyer = await LawyerModel.findById(id);
      if (!lawyer) throw new Error('Lawyer not found');

      const match = await bcrypt.compare(oldPass, String(lawyer.password));
      if (!match) throw new Error('Incorrect old password');

      lawyer.password = await bcrypt.hash(newPass, 10);
      await lawyer.save();
    } catch (error: any) {
      throw new InternalServerError('changePassword failed: ' + (error.message || error));
    }
  }


  async updateGoogleId(id: string, googleId: string): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(id, { googleId });
    } catch (error: any) {
      throw new InternalServerError("Database error while updating lawyer googleId.");
    }
  }



  async forgotpassword(id: string, hashedpassword: string): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(id, { password: hashedpassword })
    } catch (error) {

    }
  }

  async updateSubscriptionStatus(id: string, subscriptionId: string, paymentVerified: boolean): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(id, {
        subscriptionId: subscriptionId,
        paymentVerify: paymentVerified
      });
    } catch (error: any) {
      throw new InternalServerError("Database error while updating lawyer subscription status.");
    }
  }

  private mapToDomain(doc: ILawyerDocument): Lawyer {
    return {
      id: String(doc._id),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      phone: doc.phone,
      role: doc.role,
      hasSubmittedVerification:doc.hasSubmittedVerification,
      isBlock: doc.isBlock,
      googleId: doc.googleId,
      
      barNumber: doc.barNumber,
      barAdmissionDate: doc.barAdmissionDate,
      yearsOfPractice: doc.yearsOfPractice,
      practiceAreas: doc.practiceAreas,
      languages: doc.languages,
      documentUrls: doc.documentUrls,
      verificationStatus: doc.verificationStatus,
      isVerified: doc.isVerified,
      isAdminVerified: doc.isAdminVerified,
      addresses: doc.Address,
      profileImage: doc.Profileimageurl,
      bio: doc.bio,
      isPassword: doc.password ? true : false,
      paymentVerify: doc.paymentVerify,
      consultationFee: doc.consultationFee,
      walletBalance: doc.walletBalance
    };
  }

  async updateWalletBalance(lawyerId: string, amount: number): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(lawyerId, {
        $inc: { walletBalance: amount }
      });
    } catch (error: any) {
      throw new InternalServerError("Database error while updating lawyer wallet balance.");
    }
  }
}

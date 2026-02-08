import mongoose from "mongoose";
import LawyerModel, { ILawyerDocument } from "../../db/models/LawyerModel";
import LawyerSubscriptionModel from "../../db/models/LawyerSubscriptionModel";

import { VerificationLawyerDTO } from "../../../application/dtos/lawyer/VerificationLawyerDTO";
import { Lawyer } from "../../../domain/entities/Lawyer";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { UpdateLawyerProfileDTO } from "../../../application/dtos/lawyer/UpdateLawyerProfileDTO";
import bcrypt from "bcrypt";
import { ConflictError } from "../../errors/ConflictError";
import { InternalServerError } from "../../errors/InternalServerError";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { MessageConstants } from "../../constants/MessageConstants";
import { BaseRepository } from "../BaseRepository";


//  LawyerRepository

export class LawyerRepository extends BaseRepository<ILawyerDocument> implements ILawyerRepository {

  constructor() {
    super(LawyerModel);
  }

  // ------------------------------------------------------------
  //  create() - For initial registration
  // ------------------------------------------------------------
  async create(lawyer: Partial<Lawyer>): Promise<Lawyer> {
    try {
      const lawyerDoc = await LawyerModel.create(lawyer);
      return this.mapToDomain(lawyerDoc);
    } catch (error: unknown) {
      const err = error as { code?: number };
      if (err.code === 11000) {
        throw new ConflictError("A lawyer with this email already exists.");
      }
      throw new InternalServerError(MessageConstants.REPOSITORY.CREATE_ERROR);
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
    } catch (error: unknown) {

      throw new InternalServerError(MessageConstants.REPOSITORY.EMAIL_FETCH_ERROR);
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
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.VERIFICATION_SUBMISSION_ERROR);
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

      const andConditions: mongoose.FilterQuery<ILawyerDocument>[] = [];


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
        const lowerFilter = filter.toLowerCase();
        if (query?.fromAdmin) {
          if (lowerFilter === "blocked") {
            andConditions.push({ isBlock: true });
          } else if (lowerFilter === "active") {
            andConditions.push({ isBlock: false });
          } else if (["approved", "rejected", "pending"].includes(lowerFilter)) {

            andConditions.push({ verificationStatus: { $regex: `^${filter}$`, $options: "i" } });
          } else {
            andConditions.push({
              practiceAreas: { $regex: filter, $options: "i" },
            });
          }
        } else {
          andConditions.push({
            practiceAreas: { $regex: filter, $options: "i" },
          });
        }
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


      const sortOption: { [key: string]: mongoose.SortOrder } = {};
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
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.FETCH_ERROR);
    }
  }


  // ------------------------------------------------------------
  //  blockLawyer()
  // ------------------------------------------------------------
  async blockLawyer(id: string): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(id, { isBlock: true });
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.BLOCK_ERROR);
    }
  }

  // ------------------------------------------------------------
  //  unBlockLawyer()
  // ------------------------------------------------------------
  async unBlockLawyer(id: string): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(id, { isBlock: false });
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.UNBLOCK_ERROR);
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
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.APPROVE_ERROR);
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
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.REJECT_ERROR);
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
    } catch (error: unknown) {
      const err = error as Error;
      throw new InternalServerError(err.message || MessageConstants.REPOSITORY.PROFILE_FETCH_ERROR);
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
    } catch (error: unknown) {
      const err = error as Error;
      throw new InternalServerError(err.message || MessageConstants.REPOSITORY.PROFILE_UPDATE_ERROR);
    }
  }

  // ------------------------------------------------------------
  //  changePassword()
  // ------------------------------------------------------------
  async changePassword(id: string, oldPass: string, newPass: string): Promise<void> {
    const lawyer = await LawyerModel.findById(id);
    if (!lawyer) throw new NotFoundError('Lawyer not found');

    const match = await bcrypt.compare(oldPass, String(lawyer.password));
    if (!match) throw new BadRequestError('Incorrect old password');

    lawyer.password = await bcrypt.hash(newPass, 10);
    await lawyer.save();
  }


  async updateGoogleId(id: string, googleId: string): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(id, { googleId });
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.GOOGLE_ID_UPDATE_ERROR);
    }
  }



  async forgotpassword(id: string, hashedpassword: string): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(id, { password: hashedpassword })
    } catch (error) {

    }
  }

  async updateSubscriptionStatus(id: string, subscriptionId: string, paymentVerified: boolean, startDate: Date, expiryDate: Date): Promise<void> {
    try {
      await LawyerSubscriptionModel.updateMany(
        { lawyerId: id, status: 'active' },
        { status: 'upgraded' }
      );

      await LawyerSubscriptionModel.create({
        lawyerId: id,
        subscriptionId: subscriptionId,
        startDate: startDate,
        expiryDate: expiryDate,
        paymentVerify: paymentVerified,
        status: 'active'
      });

      await LawyerModel.findByIdAndUpdate(id, {
        subscriptionId: subscriptionId,
        paymentVerify: paymentVerified,
        subscriptionStartDate: startDate,
        subscriptionExpiryDate: expiryDate
      });
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.SUBSCRIPTION_UPDATE_ERROR);
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
      hasSubmittedVerification: doc.hasSubmittedVerification,
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
      walletBalance: doc.walletBalance,
      subscriptionId: doc.subscriptionId ? String(doc.subscriptionId) : undefined,
      subscriptionStartDate: doc.subscriptionStartDate,
      subscriptionExpiryDate: doc.subscriptionExpiryDate
    };
  }

  async updateWalletBalance(lawyerId: string, amount: number): Promise<void> {
    try {
      await LawyerModel.findByIdAndUpdate(lawyerId, {
        $inc: { walletBalance: amount }
      });
    } catch (error: unknown) {
      throw new InternalServerError(MessageConstants.REPOSITORY.WALLET_UPDATE_ERROR);
    }
  }
}

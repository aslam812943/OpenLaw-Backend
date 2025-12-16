"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerRepository = void 0;
const LawyerModel_1 = __importDefault(require("../../db/models/LawyerModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ConflictError_1 = require("../../errors/ConflictError");
const InternalServerError_1 = require("../../errors/InternalServerError");
//  LawyerRepository
class LawyerRepository {
    constructor() { }
    // ------------------------------------------------------------
    //  create() - For initial registration
    // ------------------------------------------------------------
    async create(lawyer) {
        try {
            const lawyerDoc = await LawyerModel_1.default.create(lawyer);
            return this.mapToDomain(lawyerDoc);
        }
        catch (error) {
            if (error.code === 11000) {
                throw new ConflictError_1.ConflictError("A lawyer with this email already exists.");
            }
            throw new InternalServerError_1.InternalServerError("Database error while creating lawyer.");
        }
    }
    // ------------------------------------------------------------
    //  findByEmail()
    // ------------------------------------------------------------
    async findByEmail(email) {
        try {
            const lawyerDoc = await LawyerModel_1.default.findOne({ email });
            if (!lawyerDoc)
                return null;
            return this.mapToDomain(lawyerDoc);
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while fetching lawyer by email.");
        }
    }
    // ------------------------------------------------------------
    //  addVerificationDetils() - For submitting verification details
    // ------------------------------------------------------------
    async addVerificationDetils(lawyer) {
        try {
            const lawyerDoc = await LawyerModel_1.default.findByIdAndUpdate(lawyer.userId, {
                barNumber: lawyer.barNumber,
                barAdmissionDate: lawyer.barAdmissionDate,
                yearsOfPractice: lawyer.yearsOfPractice,
                practiceAreas: lawyer.practiceAreas,
                languages: lawyer.languages,
                documentUrls: lawyer.documentUrls,
                hasSubmittedVerification: true,
                verificationStatus: 'pending',
                isAdminVerified: false
            }, { new: true });
            if (!lawyerDoc)
                throw new Error("Lawyer not found for verification submission.");
            return this.mapToDomain(lawyerDoc);
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while updating lawyer verification details.");
        }
    }
    // ------------------------------------------------------------
    //  findAll()
    // ------------------------------------------------------------
    async findAll(query) {
        try {
            const page = query?.page ?? 1;
            const limit = query?.limit ?? 10;
            const search = query?.search ?? "";
            const sort = query?.sort ?? "";
            const filter = query?.filter ?? "";
            // MATCH CONDITIONS
            const match = {
                ...(search && {
                    $or: [
                        { practiceAreas: { $regex: search, $options: "i" } },
                        { languages: { $regex: search, $options: "i" } },
                        { name: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } },
                    ],
                }),
            };
            if (!query?.fromAdmin) {
                match.isBlock = false;
                match.isAdminVerified = true;
                match.verificationStatus = 'Approved';
            }
            // FILTER FEATURE
            if (filter) {
                match.$or = [
                    { practiceAreas: { $regex: filter, $options: "i" } },
                    { practiceAreas: { $elemMatch: { $regex: filter, $options: "i" } } },
                ];
            }
            // SORT OPTIONS
            const sortOption = {};
            switch (sort) {
                case "experience-asc":
                    sortOption["yearsOfPractice"] = 1;
                    break;
                case "experience-desc":
                    sortOption["yearsOfPractice"] = -1;
                    break;
                default:
                    sortOption["_id"] = -1;
            }
            const [lawyerDocs, total] = await Promise.all([
                LawyerModel_1.default.find(match).sort(sortOption).skip((page - 1) * limit).limit(limit).exec(),
                LawyerModel_1.default.countDocuments(match),
            ]);
            const lawyers = lawyerDocs.map((doc) => this.mapToDomain(doc));
            return { lawyers, total };
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while fetching lawyers.");
        }
    }
    // ------------------------------------------------------------
    //  blockLawyer()
    // ------------------------------------------------------------
    async blockLawyer(id) {
        try {
            await LawyerModel_1.default.findByIdAndUpdate(id, { isBlock: true });
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while blocking lawyer.");
        }
    }
    // ------------------------------------------------------------
    //  unBlockLawyer()
    // ------------------------------------------------------------
    async unBlockLawyer(id) {
        try {
            await LawyerModel_1.default.findByIdAndUpdate(id, { isBlock: false });
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while unblocking lawyer.");
        }
    }
    // ------------------------------------------------------------
    //  approveLawyer()
    // ------------------------------------------------------------
    async approveLawyer(id) {
        try {
            await LawyerModel_1.default.findByIdAndUpdate(id, {
                isAdminVerified: true,
                verificationStatus: "Approved"
            });
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while approving lawyer.");
        }
    }
    // ------------------------------------------------------------
    //  rejectLawyer()
    // ------------------------------------------------------------
    async rejectLawyer(id) {
        try {
            await LawyerModel_1.default.findByIdAndUpdate(id, {
                isAdminVerified: false,
                verificationStatus: "Rejected"
            });
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while rejecting lawyer.");
        }
    }
    // ------------------------------------------------------------
    //  findById()
    // ------------------------------------------------------------
    async findById(id) {
        try {
            if (!id)
                throw new Error("Invalid ID: ID not provided");
            const doc = await LawyerModel_1.default.findById(id);
            if (!doc)
                throw new Error(`Lawyer with ID ${id} not found`);
            return this.mapToDomain(doc);
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message || "Database error while fetching lawyer profile.");
        }
    }
    // ------------------------------------------------------------
    //  updateProfile()
    // ------------------------------------------------------------
    async updateProfile(id, dto) {
        try {
            if (!id)
                throw new Error("Invalid ID: ID not provided");
            const data = await LawyerModel_1.default.findById(id);
            if (!data)
                throw new Error(`Lawyer with ID ${id} not found`);
            if (!data.Address) {
                data.Address = { address: "", city: "", state: "", pincode: 0 };
            }
            if (dto.imageUrl)
                data.Profileimageurl = dto.imageUrl;
            data.name = dto.name;
            data.phone = Number(dto.phone);
            data.Address.address = dto.address;
            data.Address.city = dto.city;
            data.Address.state = dto.state;
            data.Address.pincode = Number(dto.pincode);
            if (dto.bio)
                data.bio = dto.bio;
            await data.save();
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message || "Database error while updating lawyer profile.");
        }
    }
    // ------------------------------------------------------------
    //  changePassword()
    // ------------------------------------------------------------
    async changePassword(id, oldPass, newPass) {
        try {
            const lawyer = await LawyerModel_1.default.findById(id);
            if (!lawyer)
                throw new Error('Lawyer not found');
            const match = await bcrypt_1.default.compare(oldPass, String(lawyer.password));
            if (!match)
                throw new Error('Incorrect old password');
            lawyer.password = await bcrypt_1.default.hash(newPass, 10);
            await lawyer.save();
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError('changePassword failed: ' + (error.message || error));
        }
    }
    async updateGoogleId(id, googleId) {
        try {
            await LawyerModel_1.default.findByIdAndUpdate(id, { googleId });
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while updating lawyer googleId.");
        }
    }
    async forgotpassword(id, hashedpassword) {
        try {
            await LawyerModel_1.default.findByIdAndUpdate(id, { password: hashedpassword });
        }
        catch (error) {
        }
    }
    mapToDomain(doc) {
        return {
            id: String(doc._id),
            name: doc.name,
            email: doc.email,
            password: doc.password,
            phone: doc.phone,
            role: doc.role,
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
            addresses: doc.Address,
            profileImage: doc.Profileimageurl,
            bio: doc.bio,
            isPassword: doc.password ? true : false,
            hasSubmittedVerification: doc.hasSubmittedVerification
        };
    }
}
exports.LawyerRepository = LawyerRepository;
//# sourceMappingURL=LawyerRepository.js.map
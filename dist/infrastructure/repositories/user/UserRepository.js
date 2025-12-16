"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const _UserModel_1 = __importDefault(require("../../db/models/ UserModel"));
const BaseRepository_1 = require("../user/BaseRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const ConflictError_1 = require("../../errors/ConflictError");
const InternalServerError_1 = require("../../errors/InternalServerError");
const NotFoundError_1 = require("../../errors/NotFoundError");
//  UserRepository
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(_UserModel_1.default);
    }
    // ------------------------------------------------------------
    //  verifyUser() - Marks a user as verified.
    // ------------------------------------------------------------
    async verifyUser(userId) {
        try {
            await _UserModel_1.default.findByIdAndUpdate(userId, { isVerified: true });
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while verifying user.");
        }
    }
    // ------------------------------------------------------------
    //  findByEmail() - Finds a user by their email.
    // ------------------------------------------------------------
    async findByEmail(email) {
        try {
            const userDoc = await _UserModel_1.default.findOne({ email });
            if (!userDoc)
                return null;
            return {
                id: String(userDoc._id),
                name: userDoc.name,
                email: userDoc.email,
                password: userDoc.password,
                phone: Number(userDoc.phone),
                isVerified: userDoc.isVerified,
                role: userDoc.role,
                isBlock: userDoc.isBlock,
                hasSubmittedVerification: userDoc.hasSubmittedVerification ?? false,
                isPassword: userDoc.password ? true : false
            };
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while fetching user by email.");
        }
    }
    // ------------------------------------------------------------
    //  createUser() - Creates a new user.
    // ------------------------------------------------------------
    async createUser(user) {
        try {
            const userDoc = new _UserModel_1.default(user);
            await userDoc.save();
            return {
                id: String(userDoc._id),
                name: userDoc.name,
                email: userDoc.email,
                password: String(userDoc.password),
                phone: Number(userDoc.phone),
                isVerified: userDoc.isVerified,
                role: userDoc.role,
                isBlock: userDoc.isBlock,
                hasSubmittedVerification: userDoc.hasSubmittedVerification ?? false,
            };
        }
        catch (error) {
            if (error.code === 11000) {
                throw new ConflictError_1.ConflictError("A user with this email already exists.");
            }
            throw new InternalServerError_1.InternalServerError("Database error while creating a new user.");
        }
    }
    // ------------------------------------------------------------
    // updateUserPassword() - Updates a user's password.
    // ------------------------------------------------------------
    async updateUserPassword(userId, hashedPassword) {
        try {
            await this.update(userId, { password: hashedPassword });
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while updating user password.");
        }
    }
    // ------------------------------------------------------------
    //  markVerificationSubmitted() - Marks that a user has submitted verification details.
    // ------------------------------------------------------------
    async markVerificationSubmitted(userId) {
        try {
            await this.update(userId, { hasSubmittedVerification: true });
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while marking verification submission.");
        }
    }
    // ------------------------------------------------------------
    //  findAll() - Finds all users with pagination.
    // ------------------------------------------------------------
    async findAll(page, limit) {
        try {
            const skip = (page - 1) * limit;
            const [docs, total] = await Promise.all([
                _UserModel_1.default.find({ role: "user" }).skip(skip).limit(limit).exec(),
                _UserModel_1.default.countDocuments({ role: "user" }),
            ]);
            const users = docs.map((doc) => this.mapToDomain(doc));
            return { users, total };
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while fetching paginated users.");
        }
    }
    // ------------------------------------------------------------
    //  blockUser() - Blocks a user.
    // ------------------------------------------------------------
    async blockUser(id) {
        try {
            await _UserModel_1.default.findByIdAndUpdate(id, { isBlock: true });
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while blocking user.");
        }
    }
    // ------------------------------------------------------------
    // unBlockUser() - Unblocks a user.
    // ------------------------------------------------------------
    async unBlockUser(id) {
        try {
            await _UserModel_1.default.findByIdAndUpdate(id, { isBlock: false });
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while unblocking user.");
        }
    }
    mapToDomain(doc) {
        return {
            id: String(doc._id),
            name: doc.name,
            email: doc.email,
            password: doc.password,
            phone: Number(doc.phone),
            isVerified: doc.isVerified,
            role: doc.role,
            isBlock: doc.isBlock,
            hasSubmittedVerification: doc.hasSubmittedVerification ?? false,
            googleId: doc.googleId,
        };
    }
    async findById(id) {
        try {
            const doc = await _UserModel_1.default.findById(id);
            if (!doc)
                throw new Error('User document not found ');
            return {
                id: String(doc._id),
                name: doc.name,
                email: doc.email,
                password: doc.password,
                phone: Number(doc.phone),
                isVerified: doc.isVerified,
                role: doc.role,
                isBlock: doc.isBlock,
                hasSubmittedVerification: doc.hasSubmittedVerification ?? false,
                profileImage: doc.profileImage ?? '',
                address: doc.address,
                isPassword: doc.password ? true : false
            };
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError('findById failed: ' + (error.message || error));
        }
    }
    async changePassword(id, oldPass, newPass) {
        try {
            const user = await _UserModel_1.default.findById(id);
            if (!user)
                throw new Error('User not found ');
            const match = await bcrypt_1.default.compare(oldPass, String(user.password));
            if (!match)
                throw new Error('Incorrect old password ');
            user.password = await bcrypt_1.default.hash(newPass, 10);
            await user.save();
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError('changePassword failed: ' + (error.message || error));
        }
    }
    async profileUpdate(id, name, phone, imgurl, address, city, state, pincode) {
        try {
            const user = await _UserModel_1.default.findById(id);
            if (!user)
                throw new Error('user not found');
            user.name = name;
            user.phone = Number(phone);
            if (imgurl) {
                user.profileImage = imgurl;
            }
            if (!user.address) {
                user.address = {
                    address: "",
                    city: "",
                    state: '',
                    pincode: 0
                };
            }
            user.address.address = address;
            user.address.city = city;
            user.address.state = state;
            user.address.pincode = Number(pincode);
            await user.save();
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while updating profile.");
        }
    }
    async findByGoogleId(googleId) {
        const userDoc = await _UserModel_1.default.findOne({ googleId });
        if (!userDoc)
            return null;
        return this.mapToDomain(userDoc);
    }
    async save(user) {
        if (!user.id)
            throw new Error("User ID is required for update");
        const updateData = { ...user };
        delete updateData.id;
        if (user.address) {
            updateData.address = user.address;
            delete updateData.address;
        }
        if (user.profileImage) {
            updateData.profileImage = user.profileImage;
        }
        const updatedDoc = await _UserModel_1.default.findByIdAndUpdate(user.id, updateData, { new: true });
        if (!updatedDoc)
            throw new NotFoundError_1.NotFoundError("User not found for update");
        return this.mapToDomain(updatedDoc);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AddressSchema = new mongoose_1.Schema({
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
}, { _id: false });
const LawyerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    phone: { type: Number, required: false },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "lawyer" },
    hasSubmittedVerification: { type: Boolean, default: false },
    isBlock: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
    barNumber: { type: String, required: false },
    barAdmissionDate: { type: String, required: false },
    yearsOfPractice: { type: Number, required: false },
    practiceAreas: { type: [String], required: false },
    languages: { type: [String], required: false },
    documentUrls: { type: [String], required: false },
    dateOfBirth: { type: String },
    verificationStatus: { type: String, default: 'pending' },
    isAdminVerified: { type: Boolean, default: false },
    Address: { type: AddressSchema },
    Profileimageurl: { type: String },
    bio: { type: String }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Lawyer", LawyerSchema);
//# sourceMappingURL=LawyerModel.js.map
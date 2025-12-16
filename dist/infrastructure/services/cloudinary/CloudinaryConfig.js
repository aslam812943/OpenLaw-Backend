"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "Lawyers_Documents",
        allowed_formats: ["jpg", "jpeg", "png", "pdf"],
        resource_type: "auto",
        public_id: (_req, file) => Date.now() + "-" + file.originalname,
    },
});
const upload = (0, multer_1.default)({ storage });
exports.upload = upload;
//# sourceMappingURL=CloudinaryConfig.js.map
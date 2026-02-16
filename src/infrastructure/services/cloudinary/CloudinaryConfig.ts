import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import { Request } from "express";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req: Request, file: Express.Multer.File) => {
    const sanitizedName = file.originalname
      .split('.')[0]
      .replace(/\s+/g, '_')
      .replace(/[^\w-]/g, '');

    return {
      folder: "Lawyers_Documents",
      resource_type: "auto",
      public_id: `${Date.now()}-${sanitizedName}`,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 7 * 1024 * 1024,
  },
});

export { cloudinary, upload };

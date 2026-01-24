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
  params: {
    folder: "Lawyers_Documents",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto",
    public_id: (_req: Request, file: Express.Multer.File) =>
      Date.now() + "-" + file.originalname,
  } as unknown as Record<string, unknown>,
});

const upload = multer({ storage });

export { cloudinary, upload };

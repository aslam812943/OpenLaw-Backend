import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../../infrastructure/logging/logger";
dotenv.config();

export class DbConnection {
  static async connect(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGO_URI!);
      logger.info("MongoDB connected");
    } catch (error) {
      logger.error("MongoDB connection error", error);
      process.exit(1);
    }
  }
}

import "express";
import { UserRole } from "../../infrastructure/interface/enums/UserRole";

export interface JwtPayload {
  id: string;
  role: UserRole;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      admin?: JwtPayload;
    }
  }
}
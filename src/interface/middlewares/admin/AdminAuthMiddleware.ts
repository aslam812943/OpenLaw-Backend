import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";

interface JwtPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload;
    }
  }
}

export class AdminAuthMiddleware {
  execute = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Admin authentication failed. Token missing.",
        })
        return; 
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      if (decoded.role !== "admin") {
        res.status(HttpStatusCode.FORBIDDEN).json({
          success: false,
          message: "Access denied. Admin privileges required.",
        });
        return; 
      }

      req.admin = decoded;

      next(); 
    } catch (error) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        success: false,
        message: "Invalid or expired admin token.",
      });
      return;
    }
  };
}

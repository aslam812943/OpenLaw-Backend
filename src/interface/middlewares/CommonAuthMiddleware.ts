import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../../infrastructure/interface/enums/HttpStatusCode";

interface JwtPayload {
    id: string;
    role: string;
}

export const commonAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({ success: false, message: "No token provided." });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded;

        next();
    } catch (error) {
        res.status(HttpStatusCode.FORBIDDEN).json({ success: false, message: "Invalid or expired token." });
    }
};

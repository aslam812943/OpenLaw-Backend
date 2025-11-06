// // src/infrastructure/services/jwt/JwtService.ts
// import jwt from "jsonwebtoken";
// import { IJwtService } from "../../../application/interface/services/IJwtService";

// export class JwtService implements IJwtService {
//   private readonly secret = process.env.JWT_SECRET || "supersecret";

//   generateToken(payload: object): string {
//     return jwt.sign(payload, this.secret, { expiresIn: "1d" });
//   }

//   verifyToken(token: string): any {
//     try {
//       return jwt.verify(token, this.secret);
//     } catch {
//       throw new Error("Invalid token");
//     }
//   }
// }

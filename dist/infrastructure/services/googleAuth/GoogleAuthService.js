"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthService = void 0;
const google_auth_library_1 = require("google-auth-library");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new google_auth_library_1.OAuth2Client(CLIENT_ID);
const UnauthorizedError_1 = require("../../errors/UnauthorizedError");
class GoogleAuthService {
    async verifyToken(token) {
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            const payload = ticket.getPayload();
            if (!payload)
                throw new UnauthorizedError_1.UnauthorizedError('Invalid token payload');
            return payload;
        }
        catch (error) {
            console.error("Google token verification failed:", error);
            throw new UnauthorizedError_1.UnauthorizedError("Invalid Google token.");
        }
    }
}
exports.GoogleAuthService = GoogleAuthService;
//# sourceMappingURL=GoogleAuthService.js.map
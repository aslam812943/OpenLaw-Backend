import { OAuth2Client, LoginTicket } from 'google-auth-library'



const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID)



import { AppError } from '../../errors/AppError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

export class GoogleAuthService {
    async verifyToken(token: string): Promise<LoginTicket['payload']> {
        try {

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            const payload = ticket.getPayload();
            if (!payload) throw new UnauthorizedError('Invalid token payload')

            return payload
        } catch (error) {
            console.error("Google token verification failed:", error);
            throw new UnauthorizedError("Invalid Google token.");
        }
    }
}
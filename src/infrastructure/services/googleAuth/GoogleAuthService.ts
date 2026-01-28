import { OAuth2Client, LoginTicket } from 'google-auth-library'
import { IGoogleAuthService } from '../../../application/interface/services/IGoogleAuthService';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import logger from '../../logging/logger';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID)

export class GoogleAuthService implements IGoogleAuthService {
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
            logger.error("Google token verification failed:", error);
            throw new UnauthorizedError("Invalid Google token.");
        }
    }
}
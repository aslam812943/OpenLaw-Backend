import { LoginTicket } from 'google-auth-library';

export interface IGoogleAuthService {
    verifyToken(token: string): Promise<LoginTicket['payload']>;
}

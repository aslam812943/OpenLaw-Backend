
import { IUserRepository } from '../../../domain/repositories/user/ IUserRepository';
import { User } from '../../../domain/entities/ User';
import { GoogleAuthService } from '../../../infrastructure/services/googleAuth/GoogleAuthService';
import { TokenService } from '../../../infrastructure/services/jwt/TokenService';
import { GoogleAuthResponseDTO } from '../../dtos/user/GoogleAuthResponseDTO';

export class GoogleAuthUsecase {
    constructor(
        private _userRepository: IUserRepository,
        private _googleAuthService: GoogleAuthService,
        private _tokenService: TokenService
    ) { }

    async execute(idToken: string, role?: string): Promise<GoogleAuthResponseDTO> {
        const payload = await this._googleAuthService.verifyToken(idToken);
        const { sub: googleId, email, given_name: firstName, family_name: lastName } = payload;

        let user = await this._userRepository.findByGoogleId(googleId);

        if (!user) {
            user = await this._userRepository.findByEmail(email!);

            if (user) {
                // Link existing user to Google ID
                user.googleId = googleId;
                // If user exists but role is not set (unlikely but possible), update it if provided
                if (!user.role && role) {
                    user.role = role;
                }
                user = await this._userRepository.save(user); // Assuming save updates the user
            } else {
                // New User
                if (!role) {
                    // Ask frontend to select role
                    return {
                        needsRoleSelection: true,
                        // We don't generate a full session token yet, but we might need to pass back some temp info
                        // or just rely on the frontend to send the ID token again with the role.
                        // For simplicity, let's just return the flag.
                    } as any;
                }

                const newUser: Partial<User> = {
                    name: `${firstName} ${lastName}`,
                    email: email!,
                    googleId: googleId,
                    role: role,
                    hasSubmittedVerification: false,
                    isVerified: true, // Email is verified by Google
                    isBlock: false
                };
                user = await this._userRepository.createUser(newUser as any);
            }
        }

        // Generate Token
        const token = this._tokenService.generateToken(user.id!, user.role);
        const refreshToken = this._tokenService.generateRefreshToken(user.id!, user.role);

        const response: GoogleAuthResponseDTO = {
            token: token,
            refreshToken: refreshToken,
            user: {
                id: user.id!,
                email: user.email,
                role: user.role as 'user' | 'lawyer',
                name: user.name,
                phone: user.phone,
                hasSubmittedVerification: user.hasSubmittedVerification
            },
            needsRoleSelection: false,
        };

        if (user.role === 'lawyer') {
            response.needsVerificationSubmission = !user.hasSubmittedVerification;
        }

        return response;
    }
}
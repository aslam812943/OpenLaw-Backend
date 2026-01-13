import { IUserRepository } from '../../../domain/repositories/user/IUserRepository';
import { ILawyerRepository } from '../../../domain/repositories/lawyer/ILawyerRepository';
import { User } from '../../../domain/entities/User';
import { IGoogleAuthService } from '../../interface/services/IGoogleAuthService';
import { ITokenService } from '../../interface/services/TokenServiceInterface';
import { GoogleAuthResponseDTO } from '../../dtos/user/GoogleAuthResponseDTO';
import { BadRequestError } from '../../../infrastructure/errors/BadRequestError';
import { UnauthorizedError } from '../../../infrastructure/errors/UnauthorizedError';
import { ForbiddenError } from '../../../infrastructure/errors/ForbiddenError';
import { IGoogleAuthUseCase } from '../../interface/use-cases/user/IGoogleAuthUseCase';
import { UserRole } from '../../../infrastructure/interface/enums/UserRole';

export class GoogleAuthUsecase implements IGoogleAuthUseCase {

  constructor(
    private _userRepository: IUserRepository,
    private _googleAuthService: IGoogleAuthService,
    private _tokenService: ITokenService,
    private _lawyerRepo: ILawyerRepository
  ) { }

  async execute(idToken: string, role?: UserRole): Promise<GoogleAuthResponseDTO> {

    if (!idToken) {
      throw new BadRequestError("Google token is missing.");
    }


    const payload = await this._googleAuthService.verifyToken(idToken);

    if (!payload || !payload.email) {
      throw new UnauthorizedError("Invalid Google token.");
    }

    const { sub: googleId, email, given_name: firstName, family_name: lastName } = payload;


    let user: any = await this._userRepository.findByGoogleId(googleId);


    if (!user) {
      user = await this._userRepository.findByEmail(email!);


      if (!user) {
        user = await this._lawyerRepo.findByEmail(email!);

      }
    }

    if (user) {

      if (user.isBlock) {
        throw new ForbiddenError("Your account has been blocked. Contact support.");
      }


      if (!user.googleId) {

        user.googleId = googleId;

        if (user.role === UserRole.LAWYER) {
          await this._lawyerRepo.updateGoogleId(user.id!, googleId);
        } else {
          user = await this._userRepository.save(user);
        }
      }
    } else {

      if (!role) {
        return {
          needsRoleSelection: true
        } as GoogleAuthResponseDTO;
      }

      const newUser = {
        name: `${firstName} ${lastName}`,
        email: email!,
        googleId,
        role,
        hasSubmittedVerification: false,
        isVerified: true,
        isBlock: false
      };


      if (role === UserRole.LAWYER) {
        user = await this._lawyerRepo.create(newUser);
      } else {
        user = await this._userRepository.createUser(newUser as User);
      }
    }


    const token = this._tokenService.generateAccessToken(user.id!, user.role, user.isBlock);
    const refreshToken = this._tokenService.generateRefreshToken(user.id!, user.role, user.isBlock);

    const response: GoogleAuthResponseDTO = {
      token,
      refreshToken,
      user: {
        id: user.id!,
        email: user.email,
        role: user.role! as UserRole,
        name: user.name,
        phone: user.phone,
        hasSubmittedVerification: user.hasSubmittedVerification,
        verificationStatus: user.verificationStatus
      },
      needsRoleSelection: false
    };

    if (user.role === UserRole.LAWYER) {
      response.needsVerificationSubmission = !user.hasSubmittedVerification;

    }

    return response;
  }
}

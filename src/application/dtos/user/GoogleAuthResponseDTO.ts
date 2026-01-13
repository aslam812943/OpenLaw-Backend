import { UserRole } from "../../../infrastructure/interface/enums/UserRole";

export interface RoleSelectionRequestDTO {
    role: UserRole;
}

export interface GoogleAuthResponseDTO {
    token: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
        name?: string;
        phone?: number;
        hasSubmittedVerification?: boolean;
        verificationStatus?: string;
    };
    needsRoleSelection: boolean;
    needsVerificationSubmission?: boolean;
}
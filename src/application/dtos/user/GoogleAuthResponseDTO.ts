export type SelectedRole = 'user' | 'lawyer';

export interface RoleSelectionRequestDTO {
    role: SelectedRole;
}

export interface GoogleAuthResponseDTO {
    token: string;
    refreshToken: string;
    user: { id: string, email: string, role: SelectedRole, name?: string, phone?: number, hasSubmittedVerification?: boolean };
    needsRoleSelection: boolean;
    needsVerificationSubmission?: boolean; // True if role='lawyer' but hasSubmittedVerification=false
}
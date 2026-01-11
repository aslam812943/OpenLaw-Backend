

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  phone: number;
  isVerified: boolean;
  role: string;
  isBlock: boolean;
  hasSubmittedVerification: boolean;
  profileImage?: string
  address?: object;
  googleId?: string
  isPassword?: boolean
  verificationStatus?: string
}


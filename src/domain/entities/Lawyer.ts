export interface Lawyer {
  id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: number;
  role: string;
  isBlock: boolean;
  googleId?: string;

  barNumber?: string;
  barAdmissionDate?: string;
  yearsOfPractice?: number;
  practiceAreas?: string[];
  languages?: string[];
  documentUrls?: string[];
  verificationStatus?: string;
  isVerified: boolean;
  addresses?: { address: string; city: string; state: string; pincode: number; };
  profileImage?: string;
  bio?: string;
  isPassword?: boolean;
  isAdminVerified?: boolean;
  hasSubmittedVerification?: boolean;
  paymentVerify?: boolean;
  consultationFee?: number;
  walletBalance?: number;
  subscriptionId?: string;
}

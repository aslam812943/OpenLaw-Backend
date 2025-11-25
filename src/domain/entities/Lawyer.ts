export interface Lawyer {
  id?: string;
  userId: string;
  barNumber: string;
  barAdmissionDate: string;
  yearsOfPractice: number;
  practiceAreas: string[];
  languages: string[];
  documentUrls: string[];
  verificationStatus?: string;
  isVerified: boolean;
  addresses?: { address: string; city: string; state: string; pincode: number; };
  profileImage: string;
  bio?: string;


  user?: {
    name: string;
    email: string;
    phone: number;
    isBlock: boolean;
  };
}

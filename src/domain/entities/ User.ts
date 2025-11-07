

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  isVerified: boolean;
  role: string;
  isBlock : boolean;
  hasSubmittedVerification:boolean;
  
}

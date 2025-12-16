

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

// export class User {
//   constructor(
//     public id: string,
//     public name: string,
//     public email: string,
//     public password: string,
//     public phone: number,
//     public isVerified: boolean,
//     public role: string,
//     public isBlock: boolean,
//     public hasSubmittedVerification: boolean
//   ) { }
// }






export interface IGetAllLawyerDTO {
  id: string;
  userId:string;
  name: string;
  email: string;
  phone: string;
  barNumber: string;
  barAdmissionDate: string;
  yearsOfPractice: number;
  practiceAreas: string[];
  languages: string[];
  documentUrls: string[];

  


  
  addressObject?: {
    address: string;
    city: string;
    state: string;
    pincode: number;
  };

  verificationStatus?: string;
  isVerified: boolean;
  isBlock: boolean;
  profileImage :string;
  consultationFee:number
}
export class ResponseGetLawyersDTO{
   id: string;
   userId:string;
     name: string;
     email: string;
     phone: string;
     yearsOfPractice: number;
     practiceAreas: string[];
     languages: string[];
   profileImage:string
    consultationFee:number
     constructor(data: IGetAllLawyerDTO) {
       this.id = data.id;
       this.userId = data.userId
       this.name = data.name;
       this.email = data.email;
       this.phone = data.phone??'';
       this.yearsOfPractice = data.yearsOfPractice;
       this.practiceAreas = data.practiceAreas;
       this.languages = data.languages;
       this.profileImage = data.profileImage??''
       this .consultationFee = data.consultationFee
     }

}
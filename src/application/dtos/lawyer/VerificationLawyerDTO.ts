export class VerificationLawyerDTO{
     userId: string;
    //  fullName:string;
    //  email:string;
    //  phone:string;
    barNumber:string;
    barAdmissionDate:string;
    yearsOfPractice:number;
    practiceAreas:string[];
    languages:string[];
    documentUrls:string[];


    constructor(data:Partial<VerificationLawyerDTO>){

if(!data.userId){
  throw new Error('User id required')
}




         if(!data.barNumber||data.barNumber.trim().length<3){
            throw new Error('Bar number is required and must be valid')
         }

         if(!data.barAdmissionDate||isNaN(Date.parse(data.barAdmissionDate))){
            throw new Error('A valid bar admission date is required')
         }

           if (
      data.yearsOfPractice === undefined ||
      data.yearsOfPractice < 0 ||
      !Number.isInteger(data.yearsOfPractice)
    ) {
      throw new Error("Years of practice must be a non-negative integer");
    }

    if (!data.practiceAreas || !Array.isArray(data.practiceAreas) || data.practiceAreas.length === 0) {
      throw new Error("At least one practice area is required");
    }

    if (!data.languages || !Array.isArray(data.languages) || data.languages.length === 0) {
      throw new Error("At least one language is required");
    }

    if (!data.documentUrls || !Array.isArray(data.documentUrls) || data.documentUrls.length === 0) {
      throw new Error("At least one document URL is required for verification");
    }

   this.userId = data.userId
    this.barNumber = data.barNumber;
    this.barAdmissionDate = data.barAdmissionDate;
    this.yearsOfPractice = data.yearsOfPractice;
    this.practiceAreas = data.practiceAreas;
    this.languages = data.languages;
    this.documentUrls = data.documentUrls
    // this.fullName = data.fullName;
    // this.email = data.email;
    // this.phone = data.phone
    }
}


export interface ILoginResponseDTO{
    id:string;
    name:string;
    email:string;
    phone:number;
    role:string;
    hasSubmittedVerification:boolean;
    verificationStatus?:string;
}







export class LoginResponseDTO implements ILoginResponseDTO{
    constructor(data:ILoginResponseDTO){
        
        this.id = data.id!;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.role = data.role
        this.hasSubmittedVerification = data.hasSubmittedVerification
        this.verificationStatus = data.verificationStatus
    }

    id:string;
    name:string;
    email: string;
    phone: number;
    role: string;
    hasSubmittedVerification:boolean;
    verificationStatus?: string | undefined;
}



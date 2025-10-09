import { Request, Response } from "express";
import { IRegisterUserUseCase } from "../../../application/interface/user/IRegisterUserUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { VerifyOtpUseCase } from "../../../application/user/auth/VerifyOtpUseCase";
import { LoginUserDTO } from "../../../application/dtos/user/LoginUserDTO";
import { LoginUserUsecase } from "../../../application/user/auth/LoginUserUsecase";
import { ResendOtpUseCase } from "../../../application/user/auth/ResendOtpUseCase";





export class AuthController {
  constructor(private _registerUserCase: IRegisterUserUseCase,private verifyOtpUseCase:VerifyOtpUseCase,
    private _loginUserUsecase:LoginUserUsecase, private _resendOtpUseCase:ResendOtpUseCase
    
  ) {}

async registerUser(req: Request, res: Response): Promise<void> {
  try {

    const result = await this._registerUserCase.execute(req.body);
    res.status(HttpStatusCode.CREATED).json({ success: true, message: result.message });
  } catch (error: any) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message });
  }
}



  async verifyOtp(req:Request,res:Response): Promise<void>{
    try{
        console.log('otp')
      const {email,otp} = req.body;
      const result = await this.verifyOtpUseCase.execute(email,otp);
      res.status(HttpStatusCode.OK).json({success:true,user:result});
    }catch(err:any){
      res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:err.message})
    }
  }



  async resendOtp(req:Request,res:Response):Promise <void>{
    try{
      console.log('resent otp')
const {email} = req.body;
console.log(email)
const message = await this._resendOtpUseCase.execute(email)
console.log(message)
res.status(HttpStatusCode.OK).json({success:true,message})
    }catch(err:any){
      res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:err.message})
    }
  }


async loginUser(req: Request,res:Response):Promise<void>{
  try{
    console.log(req.body)
    const dto = new LoginUserDTO(req.body)
    const {token,user} = await this._loginUserUsecase.execute(dto);
    console.log(user,token)
    res.status(HttpStatusCode.OK).json({success:true,token,user});
  }catch(err:any){
     console.error('Login error:', err);
    res.status(HttpStatusCode.UNAUTHORIZED).json({success:false,message:err.message})
  }
}

}

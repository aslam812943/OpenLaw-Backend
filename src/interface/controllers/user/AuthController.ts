import { Request, Response } from "express";
import { IRegisterUserUseCase } from "../../../application/interface/user/IRegisterUserUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { VerifyOtpUseCase } from "../../../application/useCases/user/auth/VerifyOtpUseCase";
 import { LoginUserDTO } from "../../../application/dtos/user/LoginUserDTO";
import { LoginUserUsecase } from "../../../application/useCases/user/auth/LoginUserUsecase";
import { ResendOtpUseCase } from "../../../application/useCases/user/auth/ResendOtpUseCase";
 import { ForgetPasswordRequestDTO } from "../../../application/dtos/user/ForgetPasswordRequestDTO";
import { RequestForgetPasswordUseCase } from "../../../application/useCases/user/auth/RequestForgetPasswordUseCase";
import { VerifyResetPasswordUseCase } from "../../../application/useCases/user/auth/VerifyResetPasswordUseCase";
// import { ResetPasswordDTO } from "../../../application/dtos/user/ResetPasswordDTO";
 import { UserRegisterDTO } from "../../../application/dtos/user/ RegisterUserDTO";



export class AuthController {
  constructor(private _registerUserCase: IRegisterUserUseCase,private verifyOtpUseCase:VerifyOtpUseCase,
    private _loginUserUsecase:LoginUserUsecase, private _resendOtpUseCase:ResendOtpUseCase,
    private _requestForgetPasswordUseCase: RequestForgetPasswordUseCase,
    private _verifyResetPasswordUseCase: VerifyResetPasswordUseCase
    
  ) {}

async registerUser(req: Request, res: Response): Promise<void> {
  try {
    console.log('authController.ts')
 const dto = new UserRegisterDTO(req.body)
    const result = await this._registerUserCase.execute(dto);
    res.status(HttpStatusCode.CREATED).json({ success: true, message: result.message });
  } catch (error: any) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message });
  }
}



  async verifyOtp(req:Request,res:Response): Promise<void>{
    try{
    
      const {email,otp} = req.body;
      const result = await this.verifyOtpUseCase.execute(email,otp);
      res.status(HttpStatusCode.OK).json({success:true,user:result});
    }catch(err:any){
      res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:err.message})
    }
  }



  async resendOtp(req:Request,res:Response):Promise <void>{
    try{
      
const {email} = req.body;

const message = await this._resendOtpUseCase.execute(email)

res.status(HttpStatusCode.OK).json({success:true,message})
    }catch(err:any){
      res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:err.message})
    }
  }




async requestForgetPassword(req:Request,res:Response):Promise<void>{

  try{
const dto = new ForgetPasswordRequestDTO(req.body);
const message = await this._requestForgetPasswordUseCase.execute(dto)
res.status(HttpStatusCode.OK).json({success:true,message});
  }catch(err:any){
res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:err.message})
  }
}



async verifyResetPassword(req:Request,res:Response):Promise<void>
{
  try{

const message  = await this._verifyResetPasswordUseCase.execute(req.body);
res.status(HttpStatusCode.OK).json({success:true,message})
  }catch(err:any){
res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message: err.message})
  }
}



async loginUser(req: Request, res: Response): Promise<void> {
  try {
    const dto = new LoginUserDTO(req.body);

   
    const { token, refreshToken, user } = await this._loginUserUsecase.execute(dto);

    res.cookie("authToken", token, {
      httpOnly: true,
       secure:false,
      //  process.env.NODE_ENV === "production",
      // sameSite: "strict",
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

   
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure:false,
      // process.env.NODE_ENV === "production",
      // sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

  
    res.status(HttpStatusCode.OK).json({
      success: true,
      token,
      refreshToken,
      user
    });
    
  } catch (err: any) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      success: false,
      message: err.message
    });
  }
}





}

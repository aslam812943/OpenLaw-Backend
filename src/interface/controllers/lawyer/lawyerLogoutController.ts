import { Request,Response } from "express";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { success } from "zod";


export class LawyerLogoutController{
    async handle(_req:Request,res:Response):Promise<void>{
    try {
        


        res.clearCookie('lawyerAccessToken',{
            httpOnly:true,
            secure:false,
            sameSite:'lax'
        })

        res.clearCookie('lawyerRefreshToken',{
            httpOnly:true,
            secure:false,
            sameSite:'lax'
        })

          res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Lawyer logged out successfully.",
              });
        
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({success:false,message:"Failed to log out. Please try again later."})
    }
    }
}
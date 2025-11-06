import { Response,Request } from "express";
import { IGetAllUsersUseCase } from "../../../application/useCases/interface/admin/IGetAllUsersUseCase";
import { GetAllUserDTO } from "../../../application/dtos/admin/GetAllUserDTO";
import { success } from "zod";



export class GetAllUsersController {
    constructor(private _getAllUserUseCase:IGetAllUsersUseCase<void,GetAllUserDTO[]>){}
    async handle(req:Request,res:Response){
        try{
            req
            console.log('reg vannu')
const users = await this._getAllUserUseCase.execute();
console.log(users)
return res.status(200).json({success:true,users})
        }catch(err){
console.log('error in admin user fech')
        }
    }
}

import { ResponseGetSingleLawyerDTO } from "../../../dtos/user/ResponseGetSingleLawyerDTO";


export interface IGetAllLawyersUseCase{
    execute(query?: { page?: number; limit?: number; search?: string ;sort?:string;filter?:string;fromAdmin?:boolean}):Promise<any>
}



export interface IGetSingleLawyerUseCase{
    execute(id:string):Promise<ResponseGetSingleLawyerDTO>
}



export interface IGetAllSlotsUseCase{
    execute(lawyerId:string):Promise<any>
}
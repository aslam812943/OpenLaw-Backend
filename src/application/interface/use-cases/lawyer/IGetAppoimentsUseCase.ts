import { ResponseGetAppoimnetsDTO } from "../../../dtos/lawyer/ResponseGetAppoimentsDTO"




export interface IGetAppoimentsUseCase{
    execute(id:string):Promise<ResponseGetAppoimnetsDTO[]>
}
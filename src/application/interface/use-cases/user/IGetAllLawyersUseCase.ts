
import { ResponseGetSingleLawyerDTO } from "../../../dtos/user/ResponseGetSingleLawyerDTO";


import { ResponseGetLawyersDTO } from "../../../dtos/user/ResponseGetLawyersDTO";
import { ResponseGetALLSlotsDTO } from "../../../dtos/user/ResponseGetALLSlotsDTO";

export interface IGetAllLawyersUseCase {
    execute(query?: { page?: number; limit?: number; search?: string; sort?: string; filter?: string; fromAdmin?: boolean }): Promise<{ success: boolean; total: number; lawyers: ResponseGetLawyersDTO[] }>
}



export interface IGetSingleLawyerUseCase {
    execute(id: string): Promise<ResponseGetSingleLawyerDTO>
}



export interface IGetAllSlotsUseCase {
    execute(lawyerId: string): Promise<ResponseGetALLSlotsDTO[]>
}
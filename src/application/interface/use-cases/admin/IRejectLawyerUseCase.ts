export interface IRejectLawyerUseCase{
    execute(id:string,email:string,reason:string):Promise <void>

    
}
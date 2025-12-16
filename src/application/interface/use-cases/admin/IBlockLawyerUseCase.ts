export interface IBlockLawyerUseCase{
    execute(lawyerId:string):Promise<void>
}
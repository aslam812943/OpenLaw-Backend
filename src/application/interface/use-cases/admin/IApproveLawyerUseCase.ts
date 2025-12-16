export interface IApproveLawyerUseCase {
    execute(id:string,email:string):Promise<void>
}
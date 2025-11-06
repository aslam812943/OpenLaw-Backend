export interface IGetAllUsersUseCase <Input ,Output>{
    execute(input:Input):Promise<Output>;
}
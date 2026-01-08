import { IUseCase } from "../common/IUseCase";
export interface IGetAllUsersUseCase<Input, Output> extends IUseCase<Input, Output> {
    execute(input: Input): Promise<Output>;
}
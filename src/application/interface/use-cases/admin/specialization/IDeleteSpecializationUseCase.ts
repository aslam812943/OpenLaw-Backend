export interface IDeleteSpecializationUseCase {
    execute(id: string): Promise<boolean>;
}

import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IUNBlockLawyerUseCase } from "../../interface/use-cases/admin/IUnBlockLawyerUseCase";


export class UNBlockLawyerUseCase implements IUNBlockLawyerUseCase {
    constructor(private _lawyerRepo: ILawyerRepository) { }
    async execute(id: string): Promise<void> {
       
        await this._lawyerRepo.unBlockLawyer(id)
    }

}
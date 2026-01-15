import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IUNBlockLawyerUseCase } from "../../interface/use-cases/admin/IUnBlockLawyerUseCase";


export class UNBlockLawyerUseCase implements IUNBlockLawyerUseCase {
    constructor(private _lawyerRepository: ILawyerRepository) { }
    async execute(lawyerId: string): Promise<void> {
       
        await this._lawyerRepository.unBlockLawyer(lawyerId)
    }

}
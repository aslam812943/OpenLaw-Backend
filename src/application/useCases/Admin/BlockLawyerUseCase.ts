import { IBlockLawyerUseCase } from "../../interface/use-cases/admin/IBlockLawyerUseCase";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository"

export class BlockLawyerUseCase implements IBlockLawyerUseCase {

    constructor(private _lawyerRepo: ILawyerRepository) { }
    async execute(lawyerId: string): Promise<void> {
        // Block the lawyer in the repository
        await this._lawyerRepo.blockLawyer(lawyerId)
    }

}
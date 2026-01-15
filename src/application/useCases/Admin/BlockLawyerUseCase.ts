import { IBlockLawyerUseCase } from "../../interface/use-cases/admin/IBlockLawyerUseCase";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository"

export class BlockLawyerUseCase implements IBlockLawyerUseCase {

    constructor(private _lawyerRepository: ILawyerRepository) { }
    async execute(lawyerId: string): Promise<void> {
        
        await this._lawyerRepository.blockLawyer(lawyerId)
    }

}
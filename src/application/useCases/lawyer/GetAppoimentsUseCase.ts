import { IGetAppoimentsUseCase } from "../../interface/use-cases/lawyer/IGetAppoimentsUseCase";
import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { ResponseGetAppoimnetsDTO } from "../../dtos/lawyer/ResponseGetAppoimentsDTO";
import { AppoimentMapper } from "../../mapper/lawyer/AppoimentMapper";


export class GetAppoimentsUseCase implements IGetAppoimentsUseCase {
    constructor(private _appoimentRepo: IAvailabilityRuleRepository) { }

    async execute(id: string): Promise<ResponseGetAppoimnetsDTO[]> {
        const response = await this._appoimentRepo.getAppoiments(id);
        return AppoimentMapper.toDTO(response);
    }
}

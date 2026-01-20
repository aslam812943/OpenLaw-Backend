import { ResponseGetSingleLawyerDTO, ILawyerData } from "../../dtos/user/ResponseGetSingleLawyerDTO";
import { Lawyer } from "../../../domain/entities/Lawyer";


export class LawyerMapper {
  static toSingle(data: Lawyer) {
    return new ResponseGetSingleLawyerDTO(data as unknown as ILawyerData);
  }
}

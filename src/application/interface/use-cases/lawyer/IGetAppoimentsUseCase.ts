import { ResponseGetAppoimnetsDTO } from "../../../dtos/lawyer/ResponseGetAppoimentsDTO"
import { BookingSearchDTO } from "../../../dtos/common/BookingSearchDTO";




export interface IGetAppoimentsUseCase {
    execute(id: string, searchDTO: BookingSearchDTO): Promise<{ appointments: ResponseGetAppoimnetsDTO[], total: number }>
}
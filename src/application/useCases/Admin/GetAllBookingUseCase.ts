import { IGetAllBookingUseCase } from "../../interface/use-cases/admin/IGetAllBookingUseCase";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { AdminBookingDTO } from "../../dtos/admin/AdminBookingDTO";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { ISubscriptionRepository } from "../../../domain/repositories/admin/ISubscriptionRepository";
import { AdminBookingMapper } from "../../mapper/admin/AdminBookingMapper";


export class GetAllBookingUseCase implements IGetAllBookingUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _lawyerRepository: ILawyerRepository,
        private _subscriptionRepository: ISubscriptionRepository
    ) { }


    async execute(page: number, limit: number, status?: string): Promise<{ bookings: AdminBookingDTO[], total: number }> {
        const { bookings, total } = await this._bookingRepository.findAll(page, limit, status);

        const lawyerCache = new Map<string, any>();
        const subscriptionCache = new Map<string, any>();

        const bookingsWithCommission = await Promise.all(bookings.map(async (booking) => {
            let commissionPercent = 0;

            let lawyer = lawyerCache.get(booking.lawyerId);
            if (lawyer === undefined) {
                lawyer = await this._lawyerRepository.findById(booking.lawyerId);
                lawyerCache.set(booking.lawyerId, lawyer || null);
            }

            if (lawyer && (lawyer as any).subscriptionId) {
                const subId = (lawyer as any).subscriptionId.toString();
                let subscription = subscriptionCache.get(subId);
                if (subscription === undefined) {
                    subscription = await this._subscriptionRepository.findById(subId);
                    subscriptionCache.set(subId, subscription || null);
                }

                if (subscription) {
                    commissionPercent = subscription.commissionPercent;
                }
            }

            return AdminBookingMapper.toDTO(booking, commissionPercent);
        }));

        return {
            bookings: bookingsWithCommission,
            total
        };
    }
}
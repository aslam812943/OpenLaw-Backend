import { AutoCancelExpiredBookingsUseCase } from "../application/useCases/lawyer/AutoCancelExpiredBookingsUseCase";
import { BookingRepository } from "../infrastructure/repositories/user/BookingRepository";
import { LawyerRepository } from "../infrastructure/repositories/lawyer/LawyerRepository";
import { WalletRepository } from "../infrastructure/repositories/user/WalletRepository";
import { AdminRepository } from "../infrastructure/repositories/admin/AdminRepository";
import { ISubscriptionRepository } from "../domain/repositories/admin/ISubscriptionRepository";
import { SubscriptionRepository } from "../infrastructure/repositories/admin/SubscriptionRepository";
import { sendNotificationUseCase } from "./container";
import { StripeService } from "../infrastructure/services/StripeService";
import { ChatRoomRepository } from "../infrastructure/repositories/ChatRoomRepository";
import { MessageRepository } from "../infrastructure/repositories/messageRepository";
import { AvailabilityRuleRepository } from "../infrastructure/repositories/lawyer/AvailabilityRuleRepository";
import { MongooseDatabaseSessionFactory } from "../infrastructure/db/MongooseDatabaseSession";

const bookingRepository = new BookingRepository();
const lawyerRepository = new LawyerRepository();
const walletRepository = new WalletRepository();
const adminRepository = new AdminRepository();
const subscriptionRepository = new SubscriptionRepository();
const stripeService = new StripeService();
const chatRoomRepository = new ChatRoomRepository();
const messageRepository = new MessageRepository();
const availabilityRuleRepository = new AvailabilityRuleRepository();
const sessionFactory = new MongooseDatabaseSessionFactory();

export const autoCancelExpiredBookingsUseCase = new AutoCancelExpiredBookingsUseCase(
    bookingRepository,
    lawyerRepository,
    walletRepository,
    adminRepository,
    subscriptionRepository,
    sendNotificationUseCase,
    stripeService,
    chatRoomRepository,
    messageRepository,
    availabilityRuleRepository,
    sessionFactory
);

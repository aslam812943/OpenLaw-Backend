
// Controllers
import { LawyerController } from "../interface/controllers/lawyer/LawyerController";
import { LawyerLogoutController } from "../interface/controllers/lawyer/lawyerLogoutController";
import { AvailabilityController } from "../interface/controllers/lawyer/AvailabilityController";
import { LawyerProfileController } from "../interface/controllers/lawyer/ProfileController";
import { AppointmentsController } from "../interface/controllers/lawyer/AppointmentsController";
import { SubscriptionController } from "../interface/controllers/lawyer/SubscriptionController";
import { SubscriptionPaymentController } from "../interface/controllers/lawyer/SubscriptionPaymentController";
import { ChatController } from "../interface/controllers/common/chat/ChatController";
import { ReviewController } from "../interface/controllers/lawyer/ReviewController";
import { LawyerCasesController } from "../interface/controllers/lawyer/LawyerCasesController";
import { LawyerEarningsController } from "../interface/controllers/lawyer/LawyerEarningsController";
import { PayoutController } from "../interface/controllers/common/payout/PayoutController";
import { LawyerDashboardController } from "../interface/controllers/lawyer/LawyerDashboardController";

// Repositories
import { AvailabilityRuleRepository } from "../infrastructure/repositories/lawyer/AvailabilityRuleRepository";
import { LawyerRepository } from "../infrastructure/repositories/lawyer/LawyerRepository";
import { BookingRepository } from "../infrastructure/repositories/user/BookingRepository";
import { ChatRoomRepository } from "../infrastructure/repositories/ChatRoomRepository";
import { MessageRepository } from "../infrastructure/repositories/messageRepository";
import { SubscriptionRepository } from "../infrastructure/repositories/admin/SubscriptionRepository";
import { PaymentRepository } from "../infrastructure/repositories/PaymentRepository";
import { WithdrawalRepository } from "../infrastructure/repositories/WithdrawalRepository";
import { ReviewRepository } from "../infrastructure/repositories/ReviewRepository";

// Services
import { TokenService } from "../infrastructure/services/jwt/TokenService";
import { StripeService } from "../infrastructure/services/StripeService";
import { upload } from "../infrastructure/services/cloudinary/CloudinaryConfig";
import { SlotGeneratorService } from "../infrastructure/services/SlotGenerator/SlotGeneratorService";

// Middlewares
import { LawyerAuthMiddleware } from "../interface/middlewares/LawyerAuthMiddleware";

// UseCases
import { RegisterLawyerUseCase } from "../application/useCases/lawyer/VerificationLawyerUseCase";
import { CreateAvailabilityRuleUseCase } from "../application/useCases/lawyer/CreateAvailabilityRuleUseCase";
import { UpdateAvailabilityRuleUseCase } from "../application/useCases/lawyer/UpdateAvailabilityRuleUseCase";
import { GetAllAvailableRuleUseCase } from "../application/useCases/lawyer/GetAllAvailabilityRulesUseCase";
import { DeleteAvailableRuleUseCase } from "../application/useCases/lawyer/DeleteAvailabileRuleUseCase";
import { GetProfileUseCase } from "../application/useCases/lawyer/GetProfileUseCase";
import { UpdateProfileUseCase } from "../application/useCases/lawyer/UpdateProfileUseCase";
import { ChangePasswordUseCase } from "../application/useCases/lawyer/ChangePasswordUseCase";
import { CheckLawyerStatusUseCase } from "../application/useCases/lawyer/CheckLawyerStatusUseCase";
import { GetAppoimentsUseCase } from "../application/useCases/lawyer/GetAppoimentsUseCase";
import { UpdateAppointmentStatusUseCase } from "../application/useCases/lawyer/UpdateAppointmentStatusUseCase";
import { GetSubscriptionPlansUseCase } from "../application/useCases/lawyer/GetSubscriptionPlansUseCase";
import { GetCurrentSubscriptionUseCase } from "../application/useCases/lawyer/GetCurrentSubscriptionUseCase";
import { CreateSubscriptionCheckoutUseCase } from "../application/useCases/lawyer/CreateSubscriptionCheckoutUseCase";
import { VerifySubscriptionPaymentUseCase } from "../application/useCases/lawyer/VerifySubscriptionPaymentUseCase";
import { CheckChatAccessUseCase } from "../application/useCases/common/chat/CheckChatAccessUseCase";
import { GetChatRoomUseCase } from "../application/useCases/common/chat/GetChatRoomUseCase";
import { GetMessagesUseCase } from "../application/useCases/common/chat/GetMessagesUseCase";
import { GetAllReviewsUseCase } from "../application/useCases/lawyer/review/GetAllReviewsUseCase";
import { GetLawyerCasesUseCase } from "../application/useCases/lawyer/GetLawyerCasesUseCase";
import { GetLawyerEarningsUseCase } from "../application/useCases/lawyer/GetLawyerEarningsUseCase";
import { RequestPayoutUseCase } from "../application/useCases/lawyer/RequestPayoutUseCase";
import { RejectPayoutUseCase } from "../application/useCases/Admin/RejectPayoutUseCase";
import { ApprovePayoutUseCase } from "../application/useCases/Admin/ApprovePayoutUseCase";
import { GetLawyerDashboardStatsUseCase } from "../application/useCases/lawyer/GetLawyerDashboardStatsUseCase";
import { SpecializationController } from "../interface/controllers/lawyer/SpecializationController";
import { GetActiveSpecializationsUseCase } from "../application/useCases/lawyer/specialization/GetActiveSpecializationsUseCase";
import { SpecializationRepository } from "../infrastructure/repositories/admin/SpecializationRepository";


// ============================================================================
//  Repository Instances
// ============================================================================
const availabilityRuleRepository = new AvailabilityRuleRepository();
const lawyerRepository = new LawyerRepository();
const bookingRepository = new BookingRepository();
const chatRoomRepository = new ChatRoomRepository();
const messageRepository = new MessageRepository();
const subscriptionRepository = new SubscriptionRepository();
const paymentRepository = new PaymentRepository();
const withdrawalRepository = new WithdrawalRepository();
const reviewRepository = new ReviewRepository();
const specializationRepository = new SpecializationRepository();

// ============================================================================
//  Service Instances
// ============================================================================
const stripeService = new StripeService();
const tokenService = new TokenService();
const slotGeneratorService = new SlotGeneratorService();

// ============================================================================
//  UseCase Instances
// ============================================================================
const registerLawyerUseCase = new RegisterLawyerUseCase(lawyerRepository);
const createAvailabilityRuleUseCase = new CreateAvailabilityRuleUseCase(availabilityRuleRepository, slotGeneratorService);
const updateAvailabilityRuleUseCase = new UpdateAvailabilityRuleUseCase(availabilityRuleRepository, slotGeneratorService);
const getAllAvailableRuleUseCase = new GetAllAvailableRuleUseCase(availabilityRuleRepository);
const deleteAvailableRuleUseCase = new DeleteAvailableRuleUseCase(availabilityRuleRepository);
const getProfileUseCase = new GetProfileUseCase(lawyerRepository);
const updateProfileUseCase = new UpdateProfileUseCase(lawyerRepository);
const changePasswordUseCase = new ChangePasswordUseCase(lawyerRepository);
const checkLawyerStatusUseCase = new CheckLawyerStatusUseCase(lawyerRepository);
const getAppoimentsUseCase = new GetAppoimentsUseCase(bookingRepository);
const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase(
    availabilityRuleRepository,
    bookingRepository,
    stripeService,
    lawyerRepository,
    chatRoomRepository
);

const getSubscriptionPlansUseCase = new GetSubscriptionPlansUseCase(subscriptionRepository);
const getCurrentSubscriptionUseCase = new GetCurrentSubscriptionUseCase(lawyerRepository, subscriptionRepository);
const createSubscriptionCheckoutUseCase = new CreateSubscriptionCheckoutUseCase(stripeService, lawyerRepository, subscriptionRepository);
const verifySubscriptionPaymentUseCase = new VerifySubscriptionPaymentUseCase(stripeService, lawyerRepository, paymentRepository, subscriptionRepository);

const checkChatAccessUseCase = new CheckChatAccessUseCase(bookingRepository);
const getChatRoomUseCase = new GetChatRoomUseCase(chatRoomRepository, bookingRepository);
const getMessagesUseCase = new GetMessagesUseCase(messageRepository);

const getAllReviewsUseCase = new GetAllReviewsUseCase(reviewRepository);
const getLawyerCasesUseCase = new GetLawyerCasesUseCase(bookingRepository);
const getLawyerEarningsUseCase = new GetLawyerEarningsUseCase(bookingRepository, lawyerRepository);

const requestPayoutUseCase = new RequestPayoutUseCase(withdrawalRepository, lawyerRepository);
const approvePayoutUseCase = new ApprovePayoutUseCase(withdrawalRepository, lawyerRepository);
const rejectPayoutUseCase = new RejectPayoutUseCase(withdrawalRepository, lawyerRepository);
const getLawyerDashboardStatsUseCase = new GetLawyerDashboardStatsUseCase(paymentRepository);
const getActiveSpecializationsUseCase = new GetActiveSpecializationsUseCase(specializationRepository);

// ============================================================================
//  Controller Instances
// ============================================================================
export const lawyerController = new LawyerController(registerLawyerUseCase);
export const lawyerLogoutController = new LawyerLogoutController();
export const availabilityController = new AvailabilityController(
    createAvailabilityRuleUseCase,
    updateAvailabilityRuleUseCase,
    getAllAvailableRuleUseCase,
    deleteAvailableRuleUseCase
);
export const getProfileController = new LawyerProfileController(getProfileUseCase, updateProfileUseCase, changePasswordUseCase);
export const appoimentsController = new AppointmentsController(getAppoimentsUseCase, updateAppointmentStatusUseCase);
export const subscriptionController = new SubscriptionController(getSubscriptionPlansUseCase, getCurrentSubscriptionUseCase);
export const subscriptionPaymentController = new SubscriptionPaymentController(createSubscriptionCheckoutUseCase, verifySubscriptionPaymentUseCase);
export const chatController = new ChatController(checkChatAccessUseCase, getChatRoomUseCase, getMessagesUseCase);
export const reviewController = new ReviewController(getAllReviewsUseCase);
export const lawyerCasesController = new LawyerCasesController(getLawyerCasesUseCase);
export const lawyerEarningsController = new LawyerEarningsController(getLawyerEarningsUseCase);
export const payoutController = new PayoutController(requestPayoutUseCase, approvePayoutUseCase, rejectPayoutUseCase, withdrawalRepository);
export const lawyerDashboardController = new LawyerDashboardController(getLawyerDashboardStatsUseCase);
export const specializationController = new SpecializationController(getActiveSpecializationsUseCase);

// ============================================================================
//  Middleware Instances
// ============================================================================
export const lawyerAuthMiddleware = new LawyerAuthMiddleware(checkLawyerStatusUseCase, tokenService);

export { upload };



import { Router } from "express";

// Controllers

import { LawyerController } from "../../controllers/lawyer/lawyerController";
import { LawyerLogoutController } from "../../controllers/lawyer/lawyerLogoutController";
import { AvailabilityController } from "../../controllers/lawyer/AvailabilityController";
import { GetProfileController } from "../../controllers/lawyer/ProfileController";
import { AppoimentsController } from "../../controllers/lawyer/AppoimentsController";
import { SubscriptionController } from "../../controllers/lawyer/SubscriptionController";
// Cloudinary Upload Service

import { upload } from "../../../infrastructure/services/cloudinary/CloudinaryConfig";
import { LawyerAuthMiddleware } from "../../middlewares/LawyerAuthMiddleware";
import { CheckLawyerStatusUseCase } from "../../../application/useCases/lawyer/CheckLawyerStatusUseCase";
import { AvailabilityRuleRepository } from "../../../infrastructure/repositories/lawyer/AvailabilityRuleRepository";
import { LawyerRepository } from "../../../infrastructure/repositories/lawyer/LawyerRepository";
import { UserRepository } from "../../../infrastructure/repositories/user/UserRepository";
import { TokenService } from "../../../infrastructure/services/jwt/TokenService";

import { CreateAvailabilityRuleUseCase } from "../../../application/useCases/lawyer/CreateAvailabilityRuleUseCase";
import { UpdateAvailabilityRuleUseCase } from "../../../application/useCases/lawyer/UpdateAvailabilityRuleUseCase";
import { GetAllAvailableRuleUseCase } from "../../../application/useCases/lawyer/GetAllAvailabilityRulesUseCase";
import { DeleteAvailableRuleUseCase } from "../../../application/useCases/lawyer/DeleteAvailabileRuleUseCase";
import { GetProfileUseCase } from "../../../application/useCases/lawyer/GetProfileUseCase";
import { UpdateProfileUseCase } from "../../../application/useCases/lawyer/UpdateProfileUseCase";
import { ChangePasswordUseCase } from "../../../application/useCases/lawyer/ChangePasswordUseCase";
import { GetAppoimentsUseCase } from "../../../application/useCases/lawyer/GetAppoimentsUseCase";
import { UpdateAppointmentStatusUseCase } from "../../../application/useCases/lawyer/UpdateAppointmentStatusUseCase";
import { GetSubscriptionPlansUseCase } from "../../../application/useCases/lawyer/GetSubscriptionPlansUseCase";
import { CreateSubscriptionCheckoutUseCase } from "../../../application/useCases/lawyer/CreateSubscriptionCheckoutUseCase";
import { VerifySubscriptionPaymentUseCase } from "../../../application/useCases/lawyer/VerifySubscriptionPaymentUseCase";
import { SubscriptionPaymentController } from "../../controllers/lawyer/SubscriptionPaymentController";
import { SubscriptionRepository } from "../../../infrastructure/repositories/admin/SubscriptionRepository";
import { PaymentRepository } from "../../../infrastructure/repositories/PaymentRepository";
import { StripeService } from "../../../infrastructure/services/StripeService";
// Chat Use Cases
import { CheckChatAccessUseCase } from "../../../application/useCases/common/chat/CheckChatAccessUseCase";
import { GetChatRoomUseCase } from "../../../application/useCases/common/chat/GetChatRoomUseCase";
import { GetMessagesUseCase } from "../../../application/useCases/common/chat/GetMessagesUseCase";

import { BookingRepository } from "../../../infrastructure/repositories/user/BookingRepository";
import { ChatRoomRepository } from "../../../infrastructure/repositories/ChatRoomRepository";
import { MessageRepository } from "../../../infrastructure/repositories/messageRepository";
import { ChatController } from "../../controllers/common/chat/ChatController";



import { ReviewRepository } from "../../../infrastructure/repositories/ReviewRepository";
import { GetAllReviewsUseCase } from "../../../application/useCases/lawyer/review/GetAllReviewsUseCase";
import { ReviewController } from "../../controllers/lawyer/ReviewController";
import { GetLawyerCasesUseCase } from "../../../application/useCases/lawyer/GetLawyerCasesUseCase";
import { LawyerCasesController } from "../../controllers/lawyer/LawyerCasesController";
import { GetLawyerEarningsUseCase } from "../../../application/useCases/lawyer/GetLawyerEarningsUseCase";
import { LawyerEarningsController } from "../../controllers/lawyer/LawyerEarningsController";
import { WithdrawalRepository } from "../../../infrastructure/repositories/WithdrawalRepository";
import { RequestPayoutUseCase } from "../../../application/useCases/lawyer/RequestPayoutUseCase";
import { ApprovePayoutUseCase } from "../../../application/useCases/Admin/ApprovePayoutUseCase";
import { PayoutController } from "../../controllers/common/payout/PayoutController";
import { GetLawyerDashboardStatsUseCase } from "../../../application/useCases/lawyer/GetLawyerDashboardStatsUseCase";
import { LawyerDashboardController } from "../../controllers/lawyer/LawyerDashboardController";

const router = Router();

// ============================================================================
//  Controller Instances
// ============================================================================
const lawyerController = new LawyerController();
const lawyerLogoutController = new LawyerLogoutController();

// Repository instance
const availabilityRuleRepository = new AvailabilityRuleRepository();
const lawyerRepository = new LawyerRepository()
const bookingRepository = new BookingRepository();
const chatRoomRepository = new ChatRoomRepository();
const messageRepository = new MessageRepository();
const subscriptionRepository = new SubscriptionRepository();
const stripeService = new StripeService();
const paymentRepository = new PaymentRepository();

const getSubscriptionPlansUseCase = new GetSubscriptionPlansUseCase(subscriptionRepository);
const createSubscriptionCheckoutUseCase = new CreateSubscriptionCheckoutUseCase(stripeService);
const verifySubscriptionPaymentUseCase = new VerifySubscriptionPaymentUseCase(stripeService, lawyerRepository, paymentRepository);

const subscriptionController = new SubscriptionController(getSubscriptionPlansUseCase);
const subscriptionPaymentController = new SubscriptionPaymentController(createSubscriptionCheckoutUseCase, verifySubscriptionPaymentUseCase);


// UseCase instances
const createAvailabilityRuleUseCase = new CreateAvailabilityRuleUseCase(availabilityRuleRepository);
const updateAvailabilityRuleUseCase = new UpdateAvailabilityRuleUseCase(availabilityRuleRepository);
const getAllAvailableRuleUseCase = new GetAllAvailableRuleUseCase(availabilityRuleRepository);
const deleteAvailableRuleUseCase = new DeleteAvailableRuleUseCase(availabilityRuleRepository);
const getProfileUseCase = new GetProfileUseCase(lawyerRepository)
const updateProfileUseCase = new UpdateProfileUseCase(lawyerRepository)
const changePasswordUseCase = new ChangePasswordUseCase(lawyerRepository)
const checkLawyerStatusUseCase = new CheckLawyerStatusUseCase(lawyerRepository);
const tokenService = new TokenService();
const lawyerAuthMiddleware = new LawyerAuthMiddleware(checkLawyerStatusUseCase, tokenService);
const getAppoimentsUseCase = new GetAppoimentsUseCase(availabilityRuleRepository)
const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase(availabilityRuleRepository, bookingRepository, stripeService, lawyerRepository, subscriptionRepository, chatRoomRepository);

// Chat
const checkChatAccessUseCase = new CheckChatAccessUseCase(bookingRepository);
const getChatRoomUseCase = new GetChatRoomUseCase(chatRoomRepository, bookingRepository);
const getMessagesUseCase = new GetMessagesUseCase(messageRepository);
const chatController = new ChatController(checkChatAccessUseCase, getChatRoomUseCase, getMessagesUseCase);




// Review
const reviewRepository = new ReviewRepository()
const getAllReviewsUsecCase = new GetAllReviewsUseCase(reviewRepository)
const reviewController = new ReviewController(getAllReviewsUsecCase)

// Cases
const getLawyerCasesUseCase = new GetLawyerCasesUseCase(bookingRepository);
const lawyerCasesController = new LawyerCasesController(getLawyerCasesUseCase);

// Earnings
const getLawyerEarningsUseCase = new GetLawyerEarningsUseCase(bookingRepository, lawyerRepository, subscriptionRepository);
const lawyerEarningsController = new LawyerEarningsController(getLawyerEarningsUseCase);

// Payout
const withdrawalRepository = new WithdrawalRepository();
const requestPayoutUseCase = new RequestPayoutUseCase(withdrawalRepository, lawyerRepository);
const approvePayoutUseCase = new ApprovePayoutUseCase(withdrawalRepository, lawyerRepository, subscriptionRepository);
const payoutController = new PayoutController(requestPayoutUseCase, approvePayoutUseCase, withdrawalRepository);

const getLawyerDashboardStatsUseCase = new GetLawyerDashboardStatsUseCase(paymentRepository);
const lawyerDashboardController = new LawyerDashboardController(getLawyerDashboardStatsUseCase);

// Availability Controller 
const availabilityController = new AvailabilityController(
  createAvailabilityRuleUseCase,
  updateAvailabilityRuleUseCase,
  getAllAvailableRuleUseCase,
  deleteAvailableRuleUseCase
);

const getProfileController = new GetProfileController(getProfileUseCase, updateProfileUseCase, changePasswordUseCase)
const appoimentsController = new AppoimentsController(getAppoimentsUseCase, updateAppointmentStatusUseCase)

router.post(
  "/verifyDetils",
  upload.array("documents"),
  (req, res, next) => lawyerController.registerLawyer(req, res, next)
);


router.post("/logout", (req, res, next) =>
  lawyerLogoutController.handle(req, res, next)
);



//  Schedule Management Routes

router.post("/schedule/create", lawyerAuthMiddleware.execute, (req, res, next) =>
  availabilityController.createRule(req, res, next)
);


router.put("/schedule/update/:ruleId", lawyerAuthMiddleware.execute, (req, res, next) =>
  availabilityController.updateRule(req, res, next)
);


router.get("/schedule/", lawyerAuthMiddleware.execute, (req, res, next) =>
  availabilityController.getAllRuls(req, res, next)
);

router.delete("/schedule/delete/:ruleId", (req, res, next) =>
  availabilityController.DeleteRule(req, res, next)
);



router.get('/profile', lawyerAuthMiddleware.execute, (req, res, next) => getProfileController.getDetils(req, res, next))


router.put('/profile/update', lawyerAuthMiddleware.execute, upload.single('profileImage'), (req, res, next) => getProfileController.updateProfile(req, res, next))

router.put('/profile/password', lawyerAuthMiddleware.execute, (req, res, next) => getProfileController.changePassword(req, res, next))



router.get('/appoiments', lawyerAuthMiddleware.execute, (req, res, next) => appoimentsController.getAppoiments(req, res, next))

router.patch('/appoiments/:id/status', lawyerAuthMiddleware.execute, (req, res, next) => appoimentsController.updateStatus(req, res, next));

// Chat Routes
router.get("/chat/messages/:roomId", lawyerAuthMiddleware.execute, (req, res, next) => chatController.getMessages(req, res, next));
router.get("/chat/rooms", lawyerAuthMiddleware.execute, (req, res, next) => chatController.getLawyerRooms(req, res, next));
router.get("/chat/room/:roomId", lawyerAuthMiddleware.execute, (req, res, next) => chatController.getRoomById(req, res, next));
router.post("/chat/room", lawyerAuthMiddleware.execute, (req, res, next) => chatController.getChatRoom(req, res, next));




router.get('/subscriptions', lawyerAuthMiddleware.execute, (req, res, next) => subscriptionController.getPlans(req, res, next));
router.post('/subscription/checkout', lawyerAuthMiddleware.execute, (req, res, next) => subscriptionPaymentController.createCheckout(req, res, next));
router.post('/subscription/success', lawyerAuthMiddleware.execute, (req, res, next) => subscriptionPaymentController.handleSuccess(req, res, next));

router.get(`/review/:id`, lawyerAuthMiddleware.execute, (req, res, next) => reviewController.getAllReview(req, res, next))

router.get('/cases', lawyerAuthMiddleware.execute, (req, res, next) => lawyerCasesController.getCases(req, res, next));

router.get('/earnings', lawyerAuthMiddleware.execute, (req, res, next) => lawyerEarningsController.getEarnings(req, res, next));

router.post('/payout/request', lawyerAuthMiddleware.execute, (req, res, next) => payoutController.requestPayout(req, res, next));
router.get('/payout/history', lawyerAuthMiddleware.execute, (req, res, next) => payoutController.getLawyerWithdrawals(req, res, next));

router.get('/dashboard/stats', lawyerAuthMiddleware.execute, (req, res, next) => lawyerDashboardController.getStats(req, res, next));

export default router;

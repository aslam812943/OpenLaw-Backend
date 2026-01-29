import { AuthController } from "../interface/controllers/user/AuthController";
import { GetSingleLawyerController } from "../interface/controllers/user/GetSingleLawyerController";

import { RegisterUserUsecase } from "../application/useCases/user/auth/RegisterUserUsecase";
import { SpecializationController } from "../interface/controllers/lawyer/SpecializationController";
import { GetActiveSpecializationsUseCase } from "../application/useCases/lawyer/specialization/GetActiveSpecializationsUseCase";
import { VerifyResetPasswordUseCase, IResetData } from "../application/useCases/user/auth/VerifyResetPasswordUseCase";
import { IOtpService } from "../application/interface/services/IOtpService";
import { VerifyOtpUseCase, IRegisterData } from "../application/useCases/user/auth/VerifyOtpUseCase"
import { GenerateOtpUseCase } from "../application/useCases/user/auth/GenerateOtpUseCase";
import { LoginUserUsecase } from "../application/useCases/user/auth/LoginUserUsecase";
import { ResendOtpUseCase } from "../application/useCases/user/auth/ResendOtpUseCase";
import { RequestForgetPasswordUseCase } from "../application/useCases/user/auth/RequestForgetPasswordUseCase";
import { ChangePasswordUseCase } from "../application/useCases/user/ChengePasswordUseCase";
import { ProfileEditUseCase } from "../application/useCases/user/ProfileEditUseCase";
import { GoogleAuthUsecase } from "../application/useCases/user/GoogleAuthUseCase";
import { GoogleAuthService } from "../infrastructure/services/googleAuth/GoogleAuthService";
import { GetAllLawyersUseCase } from "../application/useCases/user/GetAllLawyersUseCase";
import { GetSingleLawyerUseCase } from "../application/useCases/user/GetSingleLawyerUseCase";
import { GetAllSlotsUseCase } from "../application/useCases/user/GetAllSlotsUseCase";
import { CheckUserStatusUseCase } from "../application/useCases/user/checkUserStatusUseCase";
// Chat Use Cases
import { CheckChatAccessUseCase } from "../application/useCases/common/chat/CheckChatAccessUseCase";
import { GetChatRoomUseCase } from "../application/useCases/common/chat/GetChatRoomUseCase";
import { GetMessagesUseCase } from "../application/useCases/common/chat/GetMessagesUseCase";

// Review Use Cases
import { AddReviewUseCase } from "../application/useCases/user/review/AddReviewUseCase";
import { GetAllReviewsUseCase } from "../application/useCases/lawyer/review/GetAllReviewsUseCase";

// Cloudinary Upload Service
import { upload } from "../infrastructure/services/cloudinary/CloudinaryConfig";

import { UserAuthMiddleware } from "../interface/middlewares/UserAuthMiddleware";

import { GetProfileUseCase } from "../application/useCases/user/GetProfileUseCase";
import { GetProfileController } from "../interface/controllers/user/GetProfileController";
import { GetAllLawyersController } from "../interface/controllers/user/GetAllLawyersController";
import { ChatController } from "../interface/controllers/common/chat/ChatController";

//Repositories and Services 
import { UserRepository } from "../infrastructure/repositories/user/UserRepository";
import { AvailabilityRuleRepository } from "../infrastructure/repositories/lawyer/AvailabilityRuleRepository";
import { LawyerRepository } from "../infrastructure/repositories/lawyer/LawyerRepository";
import { PaymentRepository } from "../infrastructure/repositories/PaymentRepository";
import { BookingRepository } from "../infrastructure/repositories/user/BookingRepository";
import { ChatRoomRepository } from "../infrastructure/repositories/ChatRoomRepository";
import { MessageRepository } from "../infrastructure/repositories/messageRepository";
import { ReviewRepository } from "../infrastructure/repositories/ReviewRepository";
import { ReviewController } from "../interface/controllers/user/ReviewController";

import { BookingController } from "../interface/controllers/user/BookingController";
import { CreateBookingPaymentUseCase } from "../application/useCases/user/booking/CreateBookingPaymentUseCase";
import { ConfirmBookingUseCase } from "../application/useCases/user/booking/ConfirmBookingUseCase";
import { GetUserAppointmentsUseCase } from "../application/useCases/user/GetUserAppointmentsUseCase";
import { CancelAppointmentUseCase } from "../application/useCases/user/CancelAppointmentUseCase";
import { StripeService } from "../infrastructure/services/StripeService";
import { SubscriptionRepository } from "../infrastructure/repositories/admin/SubscriptionRepository";

import { WebhookController } from "../interface/controllers/user/WebhookController";
import { HandleWebhookUseCase } from "../application/useCases/user/booking/HandleWebhookUseCase";


import { RedisCacheService } from "../infrastructure/services/reddis/RedisCacheService";
import { SpecializationRepository } from "../infrastructure/repositories/admin/SpecializationRepository";
import { NodeMailerEmailService } from "../infrastructure/services/nodeMailer/NodeMailerEmailService";
import { OtpService } from "../infrastructure/services/otp/OtpService";
import { LoginResponseMapper } from "../application/mapper/user/LoignResponseMapper";
import { TokenService } from '../infrastructure/services/jwt/TokenService'


// all service instances
const cacheService = new RedisCacheService();
const otpService = new OtpService(cacheService);
const generateOtpUseCase = new GenerateOtpUseCase(otpService);
const mailService = new NodeMailerEmailService();
const userRepository = new UserRepository();
const loginResponseMapper = new LoginResponseMapper();
const tokenService = new TokenService();
const lawyerRepository = new LawyerRepository()
const availabilityRuleRepository = new AvailabilityRuleRepository()
const paymentRepository = new PaymentRepository();
// BookingRepository 
const bookingRepository = new BookingRepository();
const chatRoomRepository = new ChatRoomRepository();
const messageRepository = new MessageRepository();
const specializationRepository = new SpecializationRepository();
const subscriptionRepository = new SubscriptionRepository();
export const stripeService = new StripeService();

// use case instances 
const requestForgetPasswordUseCase = new RequestForgetPasswordUseCase(userRepository, otpService, mailService, lawyerRepository);
const verifyResetPasswordUseCase = new VerifyResetPasswordUseCase(userRepository, otpService as unknown as IOtpService<IResetData>, lawyerRepository);
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository, lawyerRepository, otpService as unknown as IOtpService<IRegisterData>);
const registerUserUsecase = new RegisterUserUsecase(userRepository, lawyerRepository, generateOtpUseCase, mailService);
const loginUserUsecase = new LoginUserUsecase(userRepository, loginResponseMapper, tokenService, lawyerRepository);
const resendOtpUseCase = new ResendOtpUseCase(cacheService, otpService, mailService);
const getProfileUseCase = new GetProfileUseCase(userRepository)
const changePasswordUseCase = new ChangePasswordUseCase(userRepository)
const profileEditUseCase = new ProfileEditUseCase(userRepository)
export const getProfileController = new GetProfileController(getProfileUseCase, changePasswordUseCase, profileEditUseCase)
const googleAuthService = new GoogleAuthService();
const googleAuthUseCase = new GoogleAuthUsecase(userRepository, googleAuthService, tokenService, lawyerRepository);
const getAllLawyersusecase = new GetAllLawyersUseCase(lawyerRepository)
export const getAllLawyersController = new GetAllLawyersController(getAllLawyersusecase)
const getSingleLawyerUseCase = new GetSingleLawyerUseCase(lawyerRepository)
const getAllSlotsUseCase = new GetAllSlotsUseCase(availabilityRuleRepository)
export const getSingleLawyerController = new GetSingleLawyerController(getSingleLawyerUseCase, getAllSlotsUseCase)
const checkUserStatusUseCase = new CheckUserStatusUseCase(userRepository);
export const authMiddleware = new UserAuthMiddleware(checkUserStatusUseCase, tokenService);

// Chat
const checkChatAccessUseCase = new CheckChatAccessUseCase(bookingRepository);
const getChatRoomUseCase = new GetChatRoomUseCase(chatRoomRepository, bookingRepository);

const getMessagesUseCase = new GetMessagesUseCase(messageRepository);
export const chatController = new ChatController(checkChatAccessUseCase, getChatRoomUseCase, getMessagesUseCase);

// Review
const reviewRepository = new ReviewRepository();
const getAllReviewsUseCase = new GetAllReviewsUseCase(reviewRepository)
const addReviewUseCase = new AddReviewUseCase(reviewRepository);
export const reviewController = new ReviewController(addReviewUseCase, getAllReviewsUseCase);

const getActiveSpecializationsUseCase = new GetActiveSpecializationsUseCase(specializationRepository);
export const specializationController = new SpecializationController(getActiveSpecializationsUseCase);

// Booking
const createBookingPaymentUseCase = new CreateBookingPaymentUseCase(stripeService);
const confirmBookingUseCase = new ConfirmBookingUseCase(
    bookingRepository,
    stripeService,
    availabilityRuleRepository,
    lawyerRepository,
    paymentRepository,
    chatRoomRepository,
    subscriptionRepository
);
const getUserAppointmentsUseCase = new GetUserAppointmentsUseCase(bookingRepository);
const cancelAppointmentUseCase = new CancelAppointmentUseCase(bookingRepository, availabilityRuleRepository, stripeService, lawyerRepository, chatRoomRepository);

export const bookingController = new BookingController(
    createBookingPaymentUseCase,
    confirmBookingUseCase,
    getUserAppointmentsUseCase,
    cancelAppointmentUseCase
);

// Webhook
const handleWebhookUseCase = new HandleWebhookUseCase(confirmBookingUseCase);
export const webhookController = new WebhookController(handleWebhookUseCase);

export const authController = new AuthController(
    registerUserUsecase,
    verifyOtpUseCase,
    loginUserUsecase,
    resendOtpUseCase,
    requestForgetPasswordUseCase,
    verifyResetPasswordUseCase,
    googleAuthUseCase,
    tokenService
);

export { upload };



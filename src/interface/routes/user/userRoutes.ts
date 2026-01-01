
import express from "express";
import { AuthController } from "../../controllers/user/AuthController";
import { GetSingleLawyerController } from "../../controllers/user/GetSingleLawyerController";

import { RegisterUserUsecase } from "../../../application/useCases/user/auth/RegisterUserUsecase";
import { VerifyOtpUseCase } from "../../../application/useCases/user/auth/VerifyOtpUseCase";
import { GenerateOtpUseCase } from "../../../application/useCases/user/auth/GenerateOtpUseCase";
import { LoginUserUsecase } from "../../../application/useCases/user/auth/LoginUserUsecase";
import { ResendOtpUseCase } from "../../../application/useCases/user/auth/ResendOtpUseCase";
import { RequestForgetPasswordUseCase } from "../../../application/useCases/user/auth/RequestForgetPasswordUseCase";
import { VerifyResetPasswordUseCase } from "../../../application/useCases/user/auth/VerifyResetPasswordUseCase";
import { ChangePasswordUseCase } from "../../../application/useCases/user/ChengePasswordUseCase";
import { ProfileEditUseCase } from "../../../application/useCases/user/ProfileEditUseCase";
import { GoogleAuthUsecase } from "../../../application/useCases/user/GoogleAuthUseCase";
import { GoogleAuthService } from "../../../infrastructure/services/googleAuth/GoogleAuthService";
import { GetAllLawyersUseCase } from "../../../application/useCases/user/GetAllLawyersUseCase";
import { GetSingleLawyerUseCase } from "../../../application/useCases/user/GetSingleLawyerUseCase";
import { GetAllSlotsUseCase } from "../../../application/useCases/user/GetAllSlotsUseCase";
import { CheckUserStatusUseCase } from "../../../application/useCases/user/checkUserStatusUseCase";
// Chat Use Cases
import { CheckChatAccessUseCase } from "../../../application/useCases/chat/CheckChatAccessUseCase";
import { GetChatRoomUseCase } from "../../../application/useCases/chat/GetChatRoomUseCase";
import { GetMessagesUseCase } from "../../../application/useCases/chat/GetMessagesUseCase";

// Review Use Cases
import { AddReviewUseCase } from "../../../application/useCases/user/review/AddReviewUseCase";
import { GetAllReviewsUseCase } from "../../../application/useCases/lawyer/review/GetAllReviewsUseCase";

// Cloudinary Upload Service
import { upload } from "../../../infrastructure/services/cloudinary/CloudinaryConfig";

import { UserAuthMiddleware } from "../../middlewares/UserAuthMiddleware";

import { GetProfileUseCase } from "../../../application/useCases/user/GetProfileUseCase";
import { GetProfileController } from "../../controllers/user/GetProfileController";
import { GetAllLawyersController } from "../../controllers/user/GetAllLawyersController";
import { ChatController } from "../../controllers/chat/ChatController";

//  Importing Repositories and Services 
import { UserRepository } from "../../../infrastructure/repositories/user/UserRepository";
import { AvailabilityRuleRepository } from "../../../infrastructure/repositories/lawyer/AvailabilityRuleRepository";
import { LawyerRepository } from "../../../infrastructure/repositories/lawyer/LawyerRepository";
import { BookingRepository } from "../../../infrastructure/repositories/user/BookingRepository";
import { ChatRoomRepository } from "../../../infrastructure/repositories/ChatRoomRepository";
import { MessageRepository } from "../../../infrastructure/repositories/messageRepository";
import { ReviewRepository } from "../../../infrastructure/repositories/ReviewRepository";
import { ReviewController } from "../../controllers/user/ReviewController";

import { RedisCacheService } from "../../../infrastructure/services/otp/RedisCacheService";
import { NodeMailerEmailService } from "../../../infrastructure/services/nodeMailer/NodeMailerEmailService";
import { OtpService } from "../../../infrastructure/services/otp/OtpService";
import { LoginResponseMapper } from "../../../application/mapper/user/LoignResponseMapper";
import { TokenService } from '../../../infrastructure/services/jwt/TokenService'


const router = express.Router();


//  Initialize all service instances
const cacheService = new RedisCacheService();
const otpService = new OtpService(cacheService);
const generateOtpUseCase = new GenerateOtpUseCase(otpService);
const mailService = new NodeMailerEmailService();
const userRepository = new UserRepository();
const loginResponseMapper = new LoginResponseMapper();
const tokenService = new TokenService();
const lawyerRepository = new LawyerRepository()
const availabilityRuleRepository = new AvailabilityRuleRepository()
const bookingRepository = new BookingRepository();
const chatRoomRepository = new ChatRoomRepository();
const messageRepository = new MessageRepository();

//  Initialize use case instances 
const requestForgetPasswordUseCase = new RequestForgetPasswordUseCase(userRepository, otpService, mailService, lawyerRepository);
const verifyResetPasswordUseCase = new VerifyResetPasswordUseCase(userRepository, otpService, lawyerRepository);
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository, lawyerRepository, otpService);
const registerUserUsecase = new RegisterUserUsecase(userRepository, lawyerRepository, generateOtpUseCase, mailService);
const loginUserUsecase = new LoginUserUsecase(userRepository, loginResponseMapper, tokenService, lawyerRepository);
const resendOtpUseCase = new ResendOtpUseCase(cacheService, otpService, mailService);
const getProfileUseCase = new GetProfileUseCase(userRepository)
const changePasswordUseCase = new ChangePasswordUseCase(userRepository)
const profileEditUseCase = new ProfileEditUseCase(userRepository)
const getProfileController = new GetProfileController(getProfileUseCase, changePasswordUseCase, profileEditUseCase)
const googleAuthService = new GoogleAuthService();
const googleAuthUseCase = new GoogleAuthUsecase(userRepository, googleAuthService, tokenService, lawyerRepository);
const getAllLawyersusecase = new GetAllLawyersUseCase(lawyerRepository)
const getAllLawyersController = new GetAllLawyersController(getAllLawyersusecase)
const getSingleLawyerUseCase = new GetSingleLawyerUseCase(lawyerRepository)
const getAllSlotsUseCase = new GetAllSlotsUseCase(availabilityRuleRepository)
const getSingleLawyerController = new GetSingleLawyerController(getSingleLawyerUseCase, getAllSlotsUseCase)
const checkUserStatusUseCase = new CheckUserStatusUseCase(userRepository);
const authMiddleware = new UserAuthMiddleware(checkUserStatusUseCase, tokenService);

// Chat
const checkChatAccessUseCase = new CheckChatAccessUseCase(bookingRepository);
const getChatRoomUseCase = new GetChatRoomUseCase(chatRoomRepository, bookingRepository);

const getMessagesUseCase = new GetMessagesUseCase(messageRepository);
const chatController = new ChatController(checkChatAccessUseCase, getChatRoomUseCase, getMessagesUseCase);

// Review
const reviewRepository = new ReviewRepository();
const getAllReviewsUseCase = new GetAllReviewsUseCase(reviewRepository)
const addReviewUseCase = new AddReviewUseCase(reviewRepository);
const reviewController = new ReviewController(addReviewUseCase,getAllReviewsUseCase);

const authController = new AuthController(
  registerUserUsecase,
  verifyOtpUseCase,
  loginUserUsecase,
  resendOtpUseCase,
  requestForgetPasswordUseCase,
  verifyResetPasswordUseCase,
  googleAuthUseCase
);



router.post("/register", (req, res, next) => authController.registerUser(req, res, next));


router.post("/verify-otp", (req, res, next) => authController.verifyOtp(req, res, next));


router.post("/login", (req, res, next) => authController.loginUser(req, res, next));


router.post("/google", (req, res, next) => authController.googleAuth(req, res, next));


router.post("/resend-otp", (req, res, next) => authController.resendOtp(req, res, next));


router.post("/forget-password", (req, res, next) => authController.requestForgetPassword(req, res, next));


router.post("/reset-password", (req, res, next) => authController.verifyResetPassword(req, res, next));


router.post('/logout', (req, res, next) => authController.logoutUser(req, res, next))


router.get('/profile', authMiddleware.execute, (req, res, next) => { getProfileController.getprofiledetils(req, res, next) })




router.put("/profile/update", authMiddleware.execute, upload.single("profileImage"), (req, res, next) => getProfileController.editProfile(req, res, next));


router.put('/profile/password', authMiddleware.execute, (req, res, next) => getProfileController.chengePassword(req, res, next))




router.get('/lawyers', authMiddleware.execute, (req, res, next) => getAllLawyersController.GetAllLawyers(req, res, next))


router.get(`/lawyers/:id`, authMiddleware.execute, (req, res, next) => getSingleLawyerController.getlawyer(req, res, next))

router.get(`/lawyers/slots/:id`, authMiddleware.execute, (req, res, next) => getSingleLawyerController.getallslots(req, res, next))

// Chat Routes
router.get("/chat/access/:lawyerId", authMiddleware.execute, (req, res, next) => chatController.checkAccess(req, res, next));
router.get("/chat/messages/:roomId", authMiddleware.execute, (req, res, next) => chatController.getMessages(req, res, next));
router.get("/chat/rooms", authMiddleware.execute, (req, res, next) => chatController.getUserRooms(req, res, next));
router.get("/chat/room/:roomId", authMiddleware.execute, (req, res, next) => chatController.getRoomById(req, res, next));
router.post("/chat/room", authMiddleware.execute, (req, res, next) => chatController.getChatRoom(req, res, next));
router.post("/chat/upload", authMiddleware.execute, upload.single("file"), (req, res, next) => chatController.uploadFile(req, res, next));

// Review Routes
router.post("/review", authMiddleware.execute, (req, res, next) => reviewController.addReview(req, res, next));
router.get('/review/:id',authMiddleware.execute,(req,res,next)=>reviewController.getAllReview(req,res,next))
export default router;

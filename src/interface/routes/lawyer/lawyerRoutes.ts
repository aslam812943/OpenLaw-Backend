

import { Router } from "express";

// Controllers

import { LawyerController } from "../../controllers/lawyer/lawyerController";
import { LawyerLogoutController } from "../../controllers/lawyer/lawyerLogoutController";
import { AvailabilityController } from "../../controllers/lawyer/AvailabilityController";
import { GetProfileController } from "../../controllers/lawyer/ProfileController";
import { AppoimentsController } from "../../controllers/lawyer/AppoimentsController";
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
// Chat Use Cases
import { CheckChatAccessUseCase } from "../../../application/useCases/chat/CheckChatAccessUseCase";
import { GetChatRoomUseCase } from "../../../application/useCases/chat/GetChatRoomUseCase";
import { GetMessagesUseCase } from "../../../application/useCases/chat/GetMessagesUseCase";

import { BookingRepository } from "../../../infrastructure/repositories/user/BookingRepository";
import { ChatRoomRepository } from "../../../infrastructure/repositories/ChatRoomRepository";
import { MessageRepository } from "../../../infrastructure/repositories/messageRepository";
import { ChatController } from "../../controllers/chat/ChatController";

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
const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase(availabilityRuleRepository);

// Chat
const checkChatAccessUseCase = new CheckChatAccessUseCase(bookingRepository);
const getChatRoomUseCase = new GetChatRoomUseCase(chatRoomRepository, bookingRepository);
const getMessagesUseCase = new GetMessagesUseCase(messageRepository);
const chatController = new ChatController(checkChatAccessUseCase, getChatRoomUseCase, getMessagesUseCase);


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

export default router;

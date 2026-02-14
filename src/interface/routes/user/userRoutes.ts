
import express from "express";
import {
  authController,
  getSingleLawyerController,
  specializationController,
  getProfileController,
  getAllLawyersController,
  chatController,
  reviewController,
  walletController,
  authMiddleware,
  upload
} from "../../../di/userContainer";
import { notificationController } from "../../../di/container";
import { commonAuthMiddleware } from "../../middlewares/CommonAuthMiddleware";

const router = express.Router();

// Authentication Routes
router.post("/register", (req, res, next) => authController.registerUser(req, res, next));
router.post("/verify-otp", (req, res, next) => authController.verifyOtp(req, res, next));
router.post("/login", (req, res, next) => authController.loginUser(req, res, next));
router.post("/google", (req, res, next) => authController.googleAuth(req, res, next));
router.post("/resend-otp", (req, res, next) => authController.resendOtp(req, res, next));
router.post("/forget-password", (req, res, next) => authController.requestForgetPassword(req, res, next));
router.post("/reset-password", (req, res, next) => authController.verifyResetPassword(req, res, next));
router.post('/logout', (req, res, next) => authController.logoutUser(req, res, next));
router.post("/refresh", (req, res) => authController.refreshToken(req, res));

// Profile Routes
router.get('/profile', authMiddleware.execute, (req, res, next) => { getProfileController.getProfileDetails(req, res, next) });
router.put("/profile/update", authMiddleware.execute, upload.single("profileImage"), (req, res, next) => getProfileController.editProfile(req, res, next));
router.put('/profile/password', authMiddleware.execute, (req, res, next) => getProfileController.changePassword(req, res, next));
router.get('/wallet', authMiddleware.execute, (req, res, next) => walletController.getWallet(req, res, next));

// Lawyer Routes
router.get('/lawyers', authMiddleware.execute, (req, res, next) => getAllLawyersController.getAllLawyers(req, res, next));
router.get(`/lawyers/:id`, authMiddleware.execute, (req, res, next) => getSingleLawyerController.getLawyer(req, res, next));
router.get(`/lawyers/slots/:id`, commonAuthMiddleware, (req, res, next) => getSingleLawyerController.getAllSlots(req, res, next));


// Chat Routes
router.get("/chat/access/:lawyerId", authMiddleware.execute, (req, res, next) => chatController.checkAccess(req, res, next));
router.get("/chat/messages/:roomId", authMiddleware.execute, (req, res, next) => chatController.getMessages(req, res, next));
router.get("/chat/rooms", authMiddleware.execute, (req, res, next) => chatController.getUserRooms(req, res, next));
router.get("/chat/rooms/:lawyerId", authMiddleware.execute, (req, res, next) => chatController.getLawyerSpecificRooms(req, res, next));
router.get("/chat/room/:roomId", authMiddleware.execute, (req, res, next) => chatController.getRoomById(req, res, next));
router.post("/chat/room", authMiddleware.execute, (req, res, next) => chatController.getChatRoom(req, res, next));
router.post("/chat/upload", authMiddleware.execute, upload.single("file"), (req, res, next) => chatController.uploadFile(req, res, next));

// Review Routes
router.post("/review", authMiddleware.execute, (req, res, next) => reviewController.addReview(req, res, next));
router.get('/review/:id', authMiddleware.execute, (req, res, next) => reviewController.getAllReviews(req, res, next));

// Specialization Routes
router.get('/specializations', authMiddleware.execute, (req, res, next) => specializationController.getSpecializations(req, res, next));

// Notification Routes
router.get("/notifications/:userId", authMiddleware.execute, (req, res, next) => notificationController.getNotifications(req, res, next));
router.patch("/notifications/:notificationId/read", authMiddleware.execute, (req, res, next) => notificationController.markAsRead(req, res, next));

export default router;

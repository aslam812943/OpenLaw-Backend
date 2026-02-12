

import { Router } from "express";
import {
  lawyerController,
  lawyerLogoutController,
  availabilityController,
  getProfileController,
  appoimentsController,
  subscriptionController,
  subscriptionPaymentController,
  chatController,
  reviewController,
  lawyerCasesController,
  lawyerEarningsController,
  payoutController,
  lawyerDashboardController,
  specializationController,
  lawyerAuthMiddleware,
  upload
} from "../../../di/lawyerContainer";
import { notificationController } from "../../../di/container";

const router = Router();


router.post(
  "/verifyDetils",
  upload.array("documents"),
  (req, res, next) => lawyerController.registerLawyer(req, res, next)
);

router.post("/logout", (req, res, next) =>
  lawyerLogoutController.handle(req, res, next)
);

// Schedule Management Routes
router.post("/schedule/create", lawyerAuthMiddleware.execute, (req, res, next) =>
  availabilityController.createRule(req, res, next)
);

router.put("/schedule/update/:ruleId", lawyerAuthMiddleware.execute, (req, res, next) =>
  availabilityController.updateRule(req, res, next)
);

router.get("/schedule/", lawyerAuthMiddleware.execute, (req, res, next) =>
  availabilityController.getAllRules(req, res, next)
);

router.delete("/schedule/delete/:ruleId", (req, res, next) =>
  availabilityController.deleteRule(req, res, next)
);

router.get('/profile', lawyerAuthMiddleware.execute, (req, res, next) => getProfileController.getDetails(req, res, next));

router.put('/profile/update', lawyerAuthMiddleware.execute, upload.single('profileImage'), (req, res, next) => getProfileController.updateProfile(req, res, next));

router.put('/profile/password', lawyerAuthMiddleware.execute, (req, res, next) => getProfileController.changePassword(req, res, next));

router.get('/appoiments', lawyerAuthMiddleware.execute, (req, res, next) => appoimentsController.getAppointments(req, res, next));

router.patch('/appoiments/:id/status', lawyerAuthMiddleware.execute, (req, res, next) => appoimentsController.updateStatus(req, res, next));
router.post('/appoiments/:id/follow-up', lawyerAuthMiddleware.execute, (req, res, next) => appoimentsController.setFollowUp(req, res, next));


// Chat Routes
router.get("/chat/messages/:roomId", lawyerAuthMiddleware.execute, (req, res, next) => chatController.getMessages(req, res, next));
router.get("/chat/rooms", lawyerAuthMiddleware.execute, (req, res, next) => chatController.getLawyerRooms(req, res, next));
router.get("/chat/rooms/:userId", lawyerAuthMiddleware.execute, (req, res, next) => chatController.getLawyerSpecificRooms(req, res, next));
router.get("/chat/room/:roomId", lawyerAuthMiddleware.execute, (req, res, next) => chatController.getRoomById(req, res, next));
router.post("/chat/room", lawyerAuthMiddleware.execute, (req, res, next) => chatController.getChatRoom(req, res, next));
router.post("/chat/upload", lawyerAuthMiddleware.execute, upload.single("file"), (req, res, next) => chatController.uploadFile(req, res, next));

// Subscription Routes
router.get('/subscriptions', lawyerAuthMiddleware.execute, (req, res, next) => subscriptionController.getPlans(req, res, next));
router.get('/subscription/current', lawyerAuthMiddleware.execute, (req, res, next) => subscriptionController.getCurrentSubscription(req, res, next));
router.post('/subscription/checkout', lawyerAuthMiddleware.execute, (req, res, next) => subscriptionPaymentController.createCheckout(req, res, next));
router.post('/subscription/success', lawyerAuthMiddleware.execute, (req, res, next) => subscriptionPaymentController.handleSuccess(req, res, next));

// Review Routes
router.get(`/review/:id`, lawyerAuthMiddleware.execute, (req, res, next) => reviewController.getAllReviews(req, res, next));

// Cases Routes
router.get('/cases', lawyerAuthMiddleware.execute, (req, res, next) => lawyerCasesController.getCases(req, res, next));

// Earnings Routes
router.get('/earnings', lawyerAuthMiddleware.execute, (req, res, next) => lawyerEarningsController.getEarnings(req, res, next));

// Payout Routes
router.post('/payout/request', lawyerAuthMiddleware.execute, (req, res, next) => payoutController.requestPayout(req, res, next));
router.get('/payout/history', lawyerAuthMiddleware.execute, (req, res, next) => payoutController.getLawyerWithdrawals(req, res, next));

// Dashboard Routes
router.get('/dashboard/stats', lawyerAuthMiddleware.execute, (req, res, next) => lawyerDashboardController.getStats(req, res, next));

// Specialization Routes
router.get('/specializations', (req, res, next) => specializationController.getSpecializations(req, res, next));

// Notification Routes
router.get("/notifications/:userId", lawyerAuthMiddleware.execute, (req, res, next) => notificationController.getNotifications(req, res, next));
router.patch("/notifications/:notificationId/read", lawyerAuthMiddleware.execute, (req, res, next) => notificationController.markAsRead(req, res, next));

export default router;


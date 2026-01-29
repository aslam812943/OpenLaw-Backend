
import express from 'express';
import {
    adminAuth,
    adminAuthController,
    getAllUsersController,
    blockUserController,
    unBlockUserController,
    getAllLawyersController,
    blockLawyerController,
    unBlockLawyerController,
    approveLawyerController,
    rejectLawyerController,
    adminSubscriptionController,
    getAllBookingController,
    specializationController,
    adminPaymentController,
    payoutController,
    adminDashboardController
} from '../../../di/adminContainer';

const router = express.Router();

// ------------------------------------------------------
//  Admin Routes
// ------------------------------------------------------

//  Admin Login and Logout
router.post('/login', (req, res, next) => adminAuthController.login(req, res, next));
router.post('/logout', (req, res, next) => adminAuthController.logout(req, res, next))

//  User Management Routes
router.get('/users', adminAuth, (req, res, next) => getAllUsersController.handle(req, res, next));
router.patch('/users/:id/block', adminAuth, (req, res, next) => blockUserController.handle(req, res, next));
router.patch('/users/:id/unblock', adminAuth, (req, res, next) => unBlockUserController.handle(req, res, next));

//  Lawyer Management Routes
router.get('/lawyers', adminAuth, (req, res, next) => getAllLawyersController.handle(req, res, next));
router.patch('/lawyers/:id/block', adminAuth, (req, res, next) => blockLawyerController.handle(req, res, next));
router.patch('/lawyers/:id/unblock', adminAuth, (req, res, next) => unBlockLawyerController.handle(req, res, next));
router.patch('/lawyers/:id/approve', adminAuth, (req, res, next) => approveLawyerController.handle(req, res, next));
router.patch('/lawyers/:id/reject', adminAuth, (req, res, next) => rejectLawyerController.handle(req, res, next));



// Subscription Managment Routes
router.get('/subscription', adminAuth, (req, res, next) => adminSubscriptionController.getAllSubscriptions(req, res, next));
router.post('/subscription/create', adminAuth, (req, res, next) => adminSubscriptionController.createSubscription(req, res, next));
router.patch('/subscription/:id/status', adminAuth, (req, res, next) => adminSubscriptionController.toggleSubscriptionStatus(req, res, next));
router.put('/subscription/:id', adminAuth, (req, res, next) => adminSubscriptionController.updateSubscription(req, res, next));




router.get('/payments', adminAuth, (req, res, next) => adminPaymentController.getAllPayments(req, res, next));

// Payout Routes
router.get('/payout/pending', adminAuth, (req, res, next) => payoutController.getPendingWithdrawals(req, res, next));
router.patch('/payout/:id/approve', adminAuth, (req, res, next) => payoutController.approvePayout(req, res, next));
router.patch('/payout/:id/reject', adminAuth, (req, res, next) => payoutController.rejectPayout(req, res, next));

// Dashboard Stats Route
router.get('/dashboard/stats', adminAuth, (req, res, next) => adminDashboardController.getStats(req, res, next));

// Specialization Routes
router.post('/specialization', adminAuth, (req, res, next) => specializationController.addSpecialization(req, res, next));
router.put('/specialization/:id', adminAuth, (req, res, next) => specializationController.editSpecialization(req, res, next));
router.delete('/specialization/:id', adminAuth, (req, res, next) => specializationController.deleteSpecialization(req, res, next));
router.get('/specialization', adminAuth, (req, res, next) => specializationController.getSpecializations(req, res, next));

router.get('/bookings', adminAuth, (req, res, next) => getAllBookingController.execute(req, res, next));
export default router



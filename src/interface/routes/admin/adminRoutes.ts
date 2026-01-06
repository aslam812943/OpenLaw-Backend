
import express from 'express';
import { AdminAuthMiddleware } from '../../middlewares/admin/AdminAuthMiddleware';
import { NodeMailerEmailService } from '../../../infrastructure/services/nodeMailer/NodeMailerEmailService';

//  Admin Authentication
import { AdminAuthController } from '../../controllers/admin/AdminAuthController';
import { AdminRepository } from '../../../infrastructure/repositories/admin/AdminRepository';
import { LoginAdminUseCase } from '../../../application/useCases/Admin/LoginAdminUseCase';
import { TokenService } from '../../../infrastructure/services/jwt/TokenService';

//  User Management
import { GetAllUsersController } from '../../controllers/admin/GetAllUsersController';
import { UserRepository } from '../../../infrastructure/repositories/user/UserRepository';
import { GetAllUsersUseCase } from '../../../application/useCases/Admin/GetAllUsersUseCase';
import { BlockUserController } from '../../controllers/admin/BlockUserController';
import { BlockUserUseCase } from '../../../application/useCases/Admin/BlockUserUseCase';
import { UNBlockuserUseCase } from '../../../application/useCases/Admin/UNBlockUserUseCase';
import { UNBlockUserController } from '../../controllers/admin/UNBlockUserController';

// Lawyer Management
import { LawyerRepository } from '../../../infrastructure/repositories/lawyer/LawyerRepository';
import { GetAllLawyersController } from '../../controllers/admin/GetAllLawyersController';
import { GetAllLawyersUseCase } from '../../../application/useCases/Admin/GetAllLawyersUseCase';
import { BlockLawyerUseCase } from '../../../application/useCases/Admin/BlockLawyerUseCase';
import { BlockLawyerController } from '../../controllers/admin/BlockLawyerController';
import { UNBlockLawyerUseCase } from '../../../application/useCases/Admin/UNBlockLawyerUseCase';
import { UNBlockLawyerController } from '../../controllers/admin/UNBlockLawyerController';
import { ApproveLawyerUseCase } from '../../../application/useCases/Admin/ApproveLawyerUseCase';
import { ApproveLawyerController } from '../../controllers/admin/ApproveLawyerController';
import { RejectLawyerUseCase } from '../../../application/useCases/Admin/RejectLawyerUseCase';
import { RejectLawyerController } from '../../controllers/admin/RejectLawyerController';




// Subscription Management
import { SubscriptionRepository } from '../../../infrastructure/repositories/admin/SubscriptionRepository';
import { CreateSubscriptionUseCase } from '../../../application/useCases/Admin/CreateSubscriptionUseCase';
import { GetSubscriptionsUseCase } from '../../../application/useCases/Admin/GetSubscriptionsUseCase';
import { ToggleSubscriptionStatusUseCase } from '../../../application/useCases/Admin/ToggleSubscriptionStatusUseCase';
import { AdminSubscriptionController } from '../../controllers/admin/AdminSubscriptionController';
import { WithdrawalRepository } from '../../../infrastructure/repositories/WithdrawalRepository';
import { RequestPayoutUseCase } from '../../../application/useCases/lawyer/RequestPayoutUseCase';
import { ApprovePayoutUseCase } from '../../../application/useCases/admin/ApprovePayoutUseCase';
import { PayoutController } from '../../controllers/common/payout/PayoutController';
const router = express.Router();

// ------------------------------------------------------
// Initialize Services & Core Dependencies
// ------------------------------------------------------
const tokenService = new TokenService();
const adminRepo = new AdminRepository();
const nodeMailerEmailService = new NodeMailerEmailService()
const adminAuth = new AdminAuthMiddleware().execute;
// ------------------------------------------------------
//  Admin Authentication
// ------------------------------------------------------
const loginUseCase = new LoginAdminUseCase(adminRepo, tokenService);
const controller = new AdminAuthController(loginUseCase);

// ------------------------------------------------------
// User Management Setup
// ------------------------------------------------------
const userRepo = new UserRepository();
const getAllUsersUseCase = new GetAllUsersUseCase(userRepo);
const getAllUsersController = new GetAllUsersController(getAllUsersUseCase);
const blockUserUseCase = new BlockUserUseCase(userRepo);
const blockUserController = new BlockUserController(blockUserUseCase);
const unBlockuserUseCase = new UNBlockuserUseCase(userRepo);
const unBlockUserController = new UNBlockUserController(unBlockuserUseCase);

// ------------------------------------------------------
// Lawyer Management Setup
// ------------------------------------------------------
const lawyerRepo = new LawyerRepository();
const getAllLawyersUseCase = new GetAllLawyersUseCase(lawyerRepo);
const getAllLawyersController = new GetAllLawyersController(getAllLawyersUseCase);
const blockLawyerUseCase = new BlockLawyerUseCase(lawyerRepo);
const blockLawyerController = new BlockLawyerController(blockLawyerUseCase);
const unBlockLawyerUseCase = new UNBlockLawyerUseCase(lawyerRepo);
const unBlockLawyerController = new UNBlockLawyerController(unBlockLawyerUseCase);
const approveLawyerUseCase = new ApproveLawyerUseCase(lawyerRepo, nodeMailerEmailService);
const approveLawyerController = new ApproveLawyerController(approveLawyerUseCase);
const rejectLawyerUseCase = new RejectLawyerUseCase(lawyerRepo, nodeMailerEmailService);
const rejectLawyerController = new RejectLawyerController(rejectLawyerUseCase);









// ------------------------------------------------------
// Subscription Management Setup
// ------------------------------------------------------
const subscriptionRepo = new SubscriptionRepository();
const createSubscriptionUseCase = new CreateSubscriptionUseCase(subscriptionRepo);
const getSubscriptionsUseCase = new GetSubscriptionsUseCase(subscriptionRepo);
const toggleSubscriptionStatusUseCase = new ToggleSubscriptionStatusUseCase(subscriptionRepo);
const adminSubscriptionController = new AdminSubscriptionController(createSubscriptionUseCase, getSubscriptionsUseCase, toggleSubscriptionStatusUseCase);




// ------------------------------------------------------
// Payment Management Setup
// ------------------------------------------------------
import { PaymentRepository } from '../../../infrastructure/repositories/PaymentRepository';
import { GetPaymentsUseCase } from '../../../application/useCases/Admin/GetPaymentsUseCase';
import { AdminPaymentController } from '../../controllers/admin/AdminPaymentController';

const paymentRepo = new PaymentRepository();
const getPaymentsUseCase = new GetPaymentsUseCase(paymentRepo);
const adminPaymentController = new AdminPaymentController(getPaymentsUseCase);

// Payout Management Setup
const withdrawalRepo = new WithdrawalRepository();
const requestPayoutUseCase = new RequestPayoutUseCase(withdrawalRepo, lawyerRepo);
const approvePayoutUseCase = new ApprovePayoutUseCase(withdrawalRepo, lawyerRepo, subscriptionRepo);
const payoutController = new PayoutController(requestPayoutUseCase, approvePayoutUseCase, withdrawalRepo);





// ------------------------------------------------------
//  Admin Routes
// ------------------------------------------------------


//  Admin Login and Logout
router.post('/login', (req, res, next) => controller.login(req, res, next));
router.post('/logout', (req, res, next) => controller.logout(req, res, next))

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
router.get('/subscription', adminAuth, (req, res, next) => adminSubscriptionController.getAll(req, res, next));
router.post('/subscription/create', adminAuth, (req, res, next) => adminSubscriptionController.create(req, res, next));
router.patch('/subscription/:id/status', adminAuth, (req, res, next) => adminSubscriptionController.toggleStatus(req, res, next));




router.get('/payments', adminAuth, (req, res, next) => adminPaymentController.getAllPayments(req, res, next));

// Payout Routes
router.get('/payout/pending', adminAuth, (req, res, next) => payoutController.getPendingWithdrawals(req, res, next));
router.patch('/payout/:id/approve', adminAuth, (req, res, next) => payoutController.approvePayout(req, res, next));


export default router

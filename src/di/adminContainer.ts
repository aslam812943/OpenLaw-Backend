
import { AdminAuthMiddleware } from '../interface/middlewares/admin/AdminAuthMiddleware';
import { NodeMailerEmailService } from '../infrastructure/services/nodeMailer/NodeMailerEmailService';

//  Admin Authentication
import { AdminAuthController } from '../interface/controllers/admin/AdminAuthController';
import { AdminRepository } from '../infrastructure/repositories/admin/AdminRepository';
import { LoginAdminUseCase } from '../application/useCases/Admin/LoginAdminUseCase';
import { TokenService } from '../infrastructure/services/jwt/TokenService';

//  User Management
import { GetAllUsersController } from '../interface/controllers/admin/GetAllUsersController';
import { UserRepository } from '../infrastructure/repositories/user/UserRepository';
import { GetAllUsersUseCase } from '../application/useCases/Admin/GetAllUsersUseCase';
import { BlockUserController } from '../interface/controllers/admin/BlockUserController';
import { BlockUserUseCase } from '../application/useCases/Admin/BlockUserUseCase';
import { UNBlockuserUseCase } from '../application/useCases/Admin/UNBlockUserUseCase';
import { UNBlockUserController } from '../interface/controllers/admin/UNBlockUserController';
import { BookingRepository } from '../infrastructure/repositories/user/BookingRepository';
// Lawyer Management
import { LawyerRepository } from '../infrastructure/repositories/lawyer/LawyerRepository';
import { GetAllLawyersController } from '../interface/controllers/admin/GetAllLawyersController';
import { GetAllLawyersUseCase } from '../application/useCases/Admin/GetAllLawyersUseCase';
import { BlockLawyerUseCase } from '../application/useCases/Admin/BlockLawyerUseCase';
import { BlockLawyerController } from '../interface/controllers/admin/BlockLawyerController';
import { UNBlockLawyerUseCase } from '../application/useCases/Admin/UNBlockLawyerUseCase';
import { UNBlockLawyerController } from '../interface/controllers/admin/UNBlockLawyerController';
import { ApproveLawyerUseCase } from '../application/useCases/Admin/ApproveLawyerUseCase';
import { ApproveLawyerController } from '../interface/controllers/admin/ApproveLawyerController';
import { RejectLawyerUseCase } from '../application/useCases/Admin/RejectLawyerUseCase';
import { RejectLawyerController } from '../interface/controllers/admin/RejectLawyerController';


import { GetAllBookingController } from '../interface/controllers/admin/GetAllBookingController';
import { GetAllBookingUseCase } from '../application/useCases/Admin/GetAllBookingUseCase';

// Subscription Management
import { SubscriptionRepository } from '../infrastructure/repositories/admin/SubscriptionRepository';
import { CreateSubscriptionUseCase } from '../application/useCases/Admin/CreateSubscriptionUseCase';
import { GetSubscriptionsUseCase } from '../application/useCases/Admin/GetSubscriptionsUseCase';
import { ToggleSubscriptionStatusUseCase } from '../application/useCases/Admin/ToggleSubscriptionStatusUseCase';
import { UpdateSubscriptionUseCase } from '../application/useCases/Admin/UpdateSubscriptionUseCase';
import { AdminSubscriptionController } from '../interface/controllers/admin/AdminSubscriptionController';
import { WithdrawalRepository } from '../infrastructure/repositories/WithdrawalRepository';
import { RequestPayoutUseCase } from '../application/useCases/lawyer/RequestPayoutUseCase';
import { ApprovePayoutUseCase } from '../application/useCases/Admin/ApprovePayoutUseCase';
import { RejectPayoutUseCase } from '../application/useCases/Admin/RejectPayoutUseCase';
import { PayoutController } from '../interface/controllers/common/payout/PayoutController';
import { GetAdminDashboardStatsUseCase } from '../application/useCases/Admin/GetAdminDashboardStatsUseCase';
import { AdminDashboardController } from '../interface/controllers/admin/AdminDashboardController';

// Specialization Management Setup
import { SpecializationRepository } from '../infrastructure/repositories/admin/SpecializationRepository';
import { AddSpecializationUseCase } from '../application/useCases/Admin/specialization/AddSpecializationUseCase';
import { EditSpecializationUseCase } from '../application/useCases/Admin/specialization/EditSpecializationUseCase';
import { DeleteSpecializationUseCase } from '../application/useCases/Admin/specialization/DeleteSpecializationUseCase';
import { GetSpecializationsUseCase } from '../application/useCases/Admin/specialization/GetSpecializationsUseCase';
import { SpecializationController } from '../interface/controllers/admin/SpecializationController';

// Payment Management Setup
import { PaymentRepository } from '../infrastructure/repositories/PaymentRepository';
import { GetPaymentsUseCase } from '../application/useCases/Admin/GetPaymentsUseCase';
import { AdminPaymentController } from '../interface/controllers/admin/AdminPaymentController';



// ------------------------------------------------------
// Initialize Services & Core Dependencies
// ------------------------------------------------------
const tokenService = new TokenService();
const adminRepo = new AdminRepository();
const nodeMailerEmailService = new NodeMailerEmailService()
export const adminAuth = new AdminAuthMiddleware().execute;

// ------------------------------------------------------
//  Admin Authentication
// ------------------------------------------------------
const loginUseCase = new LoginAdminUseCase(adminRepo, tokenService);
export const adminAuthController = new AdminAuthController(loginUseCase);

// ------------------------------------------------------
// User Management Setup
// ------------------------------------------------------
const userRepo = new UserRepository();
const getAllUsersUseCase = new GetAllUsersUseCase(userRepo);
export const getAllUsersController = new GetAllUsersController(getAllUsersUseCase);
const blockUserUseCase = new BlockUserUseCase(userRepo);
export const blockUserController = new BlockUserController(blockUserUseCase);
const unBlockuserUseCase = new UNBlockuserUseCase(userRepo);
export const unBlockUserController = new UNBlockUserController(unBlockuserUseCase);

// ------------------------------------------------------
// Lawyer Management Setup
// ------------------------------------------------------
const lawyerRepo = new LawyerRepository();
const getAllLawyersUseCase = new GetAllLawyersUseCase(lawyerRepo);
export const getAllLawyersController = new GetAllLawyersController(getAllLawyersUseCase);
const blockLawyerUseCase = new BlockLawyerUseCase(lawyerRepo);
export const blockLawyerController = new BlockLawyerController(blockLawyerUseCase);
const unBlockLawyerUseCase = new UNBlockLawyerUseCase(lawyerRepo);
export const unBlockLawyerController = new UNBlockLawyerController(unBlockLawyerUseCase);
const approveLawyerUseCase = new ApproveLawyerUseCase(lawyerRepo, nodeMailerEmailService);
export const approveLawyerController = new ApproveLawyerController(approveLawyerUseCase);
const rejectLawyerUseCase = new RejectLawyerUseCase(lawyerRepo, nodeMailerEmailService);
export const rejectLawyerController = new RejectLawyerController(rejectLawyerUseCase);

// ------------------------------------------------------
// Subscription Management Setup
// ------------------------------------------------------
const subscriptionRepo = new SubscriptionRepository();
const createSubscriptionUseCase = new CreateSubscriptionUseCase(subscriptionRepo);
const getSubscriptionsUseCase = new GetSubscriptionsUseCase(subscriptionRepo);
const toggleSubscriptionStatusUseCase = new ToggleSubscriptionStatusUseCase(subscriptionRepo);
const updateSubscriptionUseCase = new UpdateSubscriptionUseCase(subscriptionRepo);
export const adminSubscriptionController = new AdminSubscriptionController(createSubscriptionUseCase, getSubscriptionsUseCase, toggleSubscriptionStatusUseCase, updateSubscriptionUseCase);

// ------------------------------------------------------
// Booking Management Setup
// ------------------------------------------------------
const bookingRepo = new BookingRepository();
const getAllBookingUseCase = new GetAllBookingUseCase(bookingRepo);
export const getAllBookingController = new GetAllBookingController(getAllBookingUseCase);

// ------------------------------------------------------
// Specialization Management Setup
// ------------------------------------------------------
const specializationRepo = new SpecializationRepository();
const addSpecializationUseCase = new AddSpecializationUseCase(specializationRepo);
const editSpecializationUseCase = new EditSpecializationUseCase(specializationRepo);
const deleteSpecializationUseCase = new DeleteSpecializationUseCase(specializationRepo);
const getSpecializationsUseCase = new GetSpecializationsUseCase(specializationRepo);
export const specializationController = new SpecializationController(
    addSpecializationUseCase,
    editSpecializationUseCase,
    deleteSpecializationUseCase,
    getSpecializationsUseCase
);

// ------------------------------------------------------
// Payment Management Setup
// ------------------------------------------------------
const paymentRepo = new PaymentRepository();
const getPaymentsUseCase = new GetPaymentsUseCase(paymentRepo);
export const adminPaymentController = new AdminPaymentController(getPaymentsUseCase);

// ------------------------------------------------------
// Payout Management Setup
// ------------------------------------------------------
const withdrawalRepo = new WithdrawalRepository();
const requestPayoutUseCase = new RequestPayoutUseCase(withdrawalRepo, lawyerRepo);
const approvePayoutUseCase = new ApprovePayoutUseCase(withdrawalRepo, lawyerRepo);
const rejectPayoutUseCase = new RejectPayoutUseCase(withdrawalRepo, lawyerRepo);
export const payoutController = new PayoutController(requestPayoutUseCase, approvePayoutUseCase, rejectPayoutUseCase, withdrawalRepo);

// ------------------------------------------------------
// Dashboard Management Setup
// ------------------------------------------------------
const getAdminDashboardStatsUseCase = new GetAdminDashboardStatsUseCase(paymentRepo);
export const adminDashboardController = new AdminDashboardController(getAdminDashboardStatsUseCase);

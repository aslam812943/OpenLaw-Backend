"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminAuthMiddleware_1 = require("../../middlewares/admin/AdminAuthMiddleware");
const NodeMailerEmailService_1 = require("../../../infrastructure/services/nodeMailer/NodeMailerEmailService");
//  Admin Authentication
const AdminAuthController_1 = require("../../controllers/admin/AdminAuthController");
const AdminRepository_1 = require("../../../infrastructure/repositories/admin/AdminRepository");
const LoginAdminUseCase_1 = require("../../../application/useCases/Admin/LoginAdminUseCase");
const TokenService_1 = require("../../../infrastructure/services/jwt/TokenService");
//  User Management
const GetAllUsersController_1 = require("../../controllers/admin/GetAllUsersController");
const UserRepository_1 = require("../../../infrastructure/repositories/user/UserRepository");
const GetAllUsersUseCase_1 = require("../../../application/useCases/Admin/GetAllUsersUseCase");
const BlockUserController_1 = require("../../controllers/admin/BlockUserController");
const BlockUserUseCase_1 = require("../../../application/useCases/Admin/BlockUserUseCase");
const UNBlockUserUseCase_1 = require("../../../application/useCases/Admin/UNBlockUserUseCase");
const UNBlockUserController_1 = require("../../controllers/admin/UNBlockUserController");
// Lawyer Management
const LawyerRepository_1 = require("../../../infrastructure/repositories/lawyer/LawyerRepository");
const GetAllLawyersController_1 = require("../../controllers/admin/GetAllLawyersController");
const GetAllLawyersUseCase_1 = require("../../../application/useCases/Admin/GetAllLawyersUseCase");
const BlockLawyerUseCase_1 = require("../../../application/useCases/Admin/BlockLawyerUseCase");
const BlockLawyerController_1 = require("../../controllers/admin/BlockLawyerController");
const UNBlockLawyerUseCase_1 = require("../../../application/useCases/Admin/UNBlockLawyerUseCase");
const UNBlockLawyerController_1 = require("../../controllers/admin/UNBlockLawyerController");
const ApproveLawyerUseCase_1 = require("../../../application/useCases/Admin/ApproveLawyerUseCase");
const ApproveLawyerController_1 = require("../../controllers/admin/ApproveLawyerController");
const RejectLawyerUseCase_1 = require("../../../application/useCases/Admin/RejectLawyerUseCase");
const RejectLawyerController_1 = require("../../controllers/admin/RejectLawyerController");
const router = express_1.default.Router();
// ------------------------------------------------------
// Initialize Services & Core Dependencies
// ------------------------------------------------------
const tokenService = new TokenService_1.TokenService();
const adminRepo = new AdminRepository_1.AdminRepository();
const nodeMailerEmailService = new NodeMailerEmailService_1.NodeMailerEmailService();
const adminAuth = new AdminAuthMiddleware_1.AdminAuthMiddleware().execute;
// ------------------------------------------------------
//  Admin Authentication
// ------------------------------------------------------
const loginUseCase = new LoginAdminUseCase_1.LoginAdminUseCase(adminRepo, tokenService);
const controller = new AdminAuthController_1.AdminAuthController(loginUseCase);
// ------------------------------------------------------
// User Management Setup
// ------------------------------------------------------
const userRepo = new UserRepository_1.UserRepository();
const getAllUsersUseCase = new GetAllUsersUseCase_1.GetAllUsersUseCase(userRepo);
const getAllUsersController = new GetAllUsersController_1.GetAllUsersController(getAllUsersUseCase);
const blockUserUseCase = new BlockUserUseCase_1.BlockUserUseCase(userRepo);
const blockUserController = new BlockUserController_1.BlockUserController(blockUserUseCase);
const unBlockuserUseCase = new UNBlockUserUseCase_1.UNBlockuserUseCase(userRepo);
const unBlockUserController = new UNBlockUserController_1.UNBlockUserController(unBlockuserUseCase);
// ------------------------------------------------------
// Lawyer Management Setup
// ------------------------------------------------------
const lawyerRepo = new LawyerRepository_1.LawyerRepository();
const getAllLawyersUseCase = new GetAllLawyersUseCase_1.GetAllLawyersUseCase(lawyerRepo);
const getAllLawyersController = new GetAllLawyersController_1.GetAllLawyersController(getAllLawyersUseCase);
const blockLawyerUseCase = new BlockLawyerUseCase_1.BlockLawyerUseCase(lawyerRepo);
const blockLawyerController = new BlockLawyerController_1.BlockLawyerController(blockLawyerUseCase);
const unBlockLawyerUseCase = new UNBlockLawyerUseCase_1.UNBlockLawyerUseCase(lawyerRepo);
const unBlockLawyerController = new UNBlockLawyerController_1.UNBlockLawyerController(unBlockLawyerUseCase);
const approveLawyerUseCase = new ApproveLawyerUseCase_1.ApproveLawyerUseCase(lawyerRepo, nodeMailerEmailService);
const approveLawyerController = new ApproveLawyerController_1.ApproveLawyerController(approveLawyerUseCase);
const rejectLawyerUseCase = new RejectLawyerUseCase_1.RejectLawyerUseCase(lawyerRepo, nodeMailerEmailService);
const rejectLawyerController = new RejectLawyerController_1.RejectLawyerController(rejectLawyerUseCase);
// ------------------------------------------------------
//  Admin Routes
// ------------------------------------------------------
//  Admin Login and Logout
//  Admin Login and Logout
router.post('/login', (req, res, next) => controller.login(req, res, next));
router.post('/logout', (req, res, next) => controller.logout(req, res, next));
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
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map
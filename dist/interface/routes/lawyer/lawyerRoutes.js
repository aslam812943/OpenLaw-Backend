"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Controllers
const lawyerController_1 = require("../../controllers/lawyer/lawyerController");
const lawyerLogoutController_1 = require("../../controllers/lawyer/lawyerLogoutController");
const AvailabilityController_1 = require("../../controllers/lawyer/AvailabilityController");
const ProfileController_1 = require("../../controllers/lawyer/ProfileController");
const AppoimentsController_1 = require("../../controllers/lawyer/AppoimentsController");
// Cloudinary Upload Service
const CloudinaryConfig_1 = require("../../../infrastructure/services/cloudinary/CloudinaryConfig");
const LawyerAuthMiddleware_1 = require("../../middlewares/LawyerAuthMiddleware");
const CheckLawyerStatusUseCase_1 = require("../../../application/useCases/lawyer/CheckLawyerStatusUseCase");
const AvailabilityRuleRepository_1 = require("../../../infrastructure/repositories/lawyer/AvailabilityRuleRepository");
const LawyerRepository_1 = require("../../../infrastructure/repositories/lawyer/LawyerRepository");
const TokenService_1 = require("../../../infrastructure/services/jwt/TokenService");
const CreateAvailabilityRuleUseCase_1 = require("../../../application/useCases/lawyer/CreateAvailabilityRuleUseCase");
const UpdateAvailabilityRuleUseCase_1 = require("../../../application/useCases/lawyer/UpdateAvailabilityRuleUseCase");
const GetAllAvailabilityRulesUseCase_1 = require("../../../application/useCases/lawyer/GetAllAvailabilityRulesUseCase");
const DeleteAvailabileRuleUseCase_1 = require("../../../application/useCases/lawyer/DeleteAvailabileRuleUseCase");
const GetProfileUseCase_1 = require("../../../application/useCases/lawyer/GetProfileUseCase");
const UpdateProfileUseCase_1 = require("../../../application/useCases/lawyer/UpdateProfileUseCase");
const ChangePasswordUseCase_1 = require("../../../application/useCases/lawyer/ChangePasswordUseCase");
const GetAppoimentsUseCase_1 = require("../../../application/useCases/lawyer/GetAppoimentsUseCase");
const UpdateAppointmentStatusUseCase_1 = require("../../../application/useCases/lawyer/UpdateAppointmentStatusUseCase");
const router = (0, express_1.Router)();
// ============================================================================
//  Controller Instances
// ============================================================================
const lawyerController = new lawyerController_1.LawyerController();
const lawyerLogoutController = new lawyerLogoutController_1.LawyerLogoutController();
// Repository instance
const availabilityRuleRepository = new AvailabilityRuleRepository_1.AvailabilityRuleRepository();
const lawyerRepository = new LawyerRepository_1.LawyerRepository();
// UseCase instances
const createAvailabilityRuleUseCase = new CreateAvailabilityRuleUseCase_1.CreateAvailabilityRuleUseCase(availabilityRuleRepository);
const updateAvailabilityRuleUseCase = new UpdateAvailabilityRuleUseCase_1.UpdateAvailabilityRuleUseCase(availabilityRuleRepository);
const getAllAvailableRuleUseCase = new GetAllAvailabilityRulesUseCase_1.GetAllAvailableRuleUseCase(availabilityRuleRepository);
const deleteAvailableRuleUseCase = new DeleteAvailabileRuleUseCase_1.DeleteAvailableRuleUseCase(availabilityRuleRepository);
const getProfileUseCase = new GetProfileUseCase_1.GetProfileUseCase(lawyerRepository);
const updateProfileUseCase = new UpdateProfileUseCase_1.UpdateProfileUseCase(lawyerRepository);
const changePasswordUseCase = new ChangePasswordUseCase_1.ChangePasswordUseCase(lawyerRepository);
const checkLawyerStatusUseCase = new CheckLawyerStatusUseCase_1.CheckLawyerStatusUseCase(lawyerRepository);
const tokenService = new TokenService_1.TokenService();
const lawyerAuthMiddleware = new LawyerAuthMiddleware_1.LawyerAuthMiddleware(checkLawyerStatusUseCase, tokenService);
const getAppoimentsUseCase = new GetAppoimentsUseCase_1.GetAppoimentsUseCase(availabilityRuleRepository);
const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase_1.UpdateAppointmentStatusUseCase(availabilityRuleRepository);
// Availability Controller 
const availabilityController = new AvailabilityController_1.AvailabilityController(createAvailabilityRuleUseCase, updateAvailabilityRuleUseCase, getAllAvailableRuleUseCase, deleteAvailableRuleUseCase);
const getProfileController = new ProfileController_1.GetProfileController(getProfileUseCase, updateProfileUseCase, changePasswordUseCase);
const appoimentsController = new AppoimentsController_1.AppoimentsController(getAppoimentsUseCase, updateAppointmentStatusUseCase);
router.post("/verifyDetils", CloudinaryConfig_1.upload.array("documents"), (req, res, next) => lawyerController.registerLawyer(req, res, next));
router.post("/logout", (req, res, next) => lawyerLogoutController.handle(req, res, next));
//  Schedule Management Routes
router.post("/schedule/create", lawyerAuthMiddleware.execute, (req, res, next) => availabilityController.createRule(req, res, next));
router.put("/schedule/update/:ruleId", lawyerAuthMiddleware.execute, (req, res, next) => availabilityController.updateRule(req, res, next));
router.get("/schedule/", lawyerAuthMiddleware.execute, (req, res, next) => availabilityController.getAllRuls(req, res, next));
router.delete("/schedule/delete/:ruleId", (req, res, next) => availabilityController.DeleteRule(req, res, next));
router.get('/profile', lawyerAuthMiddleware.execute, (req, res, next) => getProfileController.getDetils(req, res, next));
router.put('/profile/update', lawyerAuthMiddleware.execute, CloudinaryConfig_1.upload.single('profileImage'), (req, res, next) => getProfileController.updateProfile(req, res, next));
router.put('/profile/password', lawyerAuthMiddleware.execute, (req, res, next) => getProfileController.changePassword(req, res, next));
router.get('/appoiments', lawyerAuthMiddleware.execute, (req, res, next) => appoimentsController.getAppoiments(req, res, next));
router.patch('/appoiments/:id/status', lawyerAuthMiddleware.execute, (req, res, next) => appoimentsController.updateStatus(req, res, next));
exports.default = router;
//# sourceMappingURL=lawyerRoutes.js.map
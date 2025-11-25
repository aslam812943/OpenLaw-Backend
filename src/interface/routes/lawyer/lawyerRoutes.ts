

import { Router } from "express";

// Controllers

import { LawyerController } from "../../controllers/lawyer/lawyerController";
import { LawyerLogoutController } from "../../controllers/lawyer/lawyerLogoutController";
import { AvailabilityController } from "../../controllers/lawyer/AvailabilityController";
import { GetProfileController } from "../../controllers/lawyer/ProfileController";

// Cloudinary Upload Service

import { upload } from "../../../infrastructure/services/cloudinary/CloudinaryConfig";
import { verifyToken } from "../../middlewares/verifyToken";
// Repository

import { AvailabilityRuleRepository } from "../../../infrastructure/repositories/lawyer/AvailabilityRuleRepository";
import { LawyerRepository } from "../../../infrastructure/repositories/lawyer/LawyerRepository";




// Use Cases 

import { CreateAvailabilityRuleUseCase } from "../../../application/useCases/lawyer/CreateAvailabilityRuleUseCase";
import { UpdateAvailabilityRuleUseCase } from "../../../application/useCases/lawyer/UpdateAvailabilityRuleUseCase";
import { GetAllAvailableRuleUseCase } from "../../../application/useCases/lawyer/GetAllAvailabilityRulesUseCase";
import { DeleteAvailableRuleUseCase } from "../../../application/useCases/lawyer/DeleteAvailabileRuleUseCase";
import { GetProfileUseCase } from "../../../application/useCases/lawyer/GetProfileUseCase";
import { UpdateProfileUseCase } from "../../../application/useCases/lawyer/UpdateProfileUseCase";

const router = Router();

// ============================================================================
//  Controller Instances
// ============================================================================
const lawyerController = new LawyerController();
const lawyerLogoutController = new LawyerLogoutController();



// Repository instance
const availabilityRuleRepository = new AvailabilityRuleRepository();
const lawyerRepository = new LawyerRepository()

// UseCase instances
const createAvailabilityRuleUseCase = new CreateAvailabilityRuleUseCase(availabilityRuleRepository);
const updateAvailabilityRuleUseCase = new UpdateAvailabilityRuleUseCase(availabilityRuleRepository);
const getAllAvailableRuleUseCase = new GetAllAvailableRuleUseCase(availabilityRuleRepository);
const deleteAvailableRuleUseCase = new DeleteAvailableRuleUseCase(availabilityRuleRepository);
const getProfileUseCase = new GetProfileUseCase(lawyerRepository)
const updateProfileUseCase = new UpdateProfileUseCase(lawyerRepository)
// Availability Controller 
const availabilityController = new AvailabilityController(
  createAvailabilityRuleUseCase,
  updateAvailabilityRuleUseCase,
  getAllAvailableRuleUseCase,
  deleteAvailableRuleUseCase
);


const getProfileController = new GetProfileController(getProfileUseCase,updateProfileUseCase)




router.post(
  "/verifyDetils",verifyToken(['lawyer']), 
  upload.array("documents"),
  (req, res) => lawyerController.registerLawyer(req, res)
);


router.post("/logout", (req, res) =>
  lawyerLogoutController.handle(req, res)
);



//  Schedule Management Routes

router.post("/schedule/create",verifyToken(['lawyer']),  (req, res) =>
  availabilityController.createRule(req, res)
);


router.put("/schedule/update/:ruleId",verifyToken(['lawyer']),  (req, res) =>
  availabilityController.updateRule(req, res)
);


router.get("/schedule/", verifyToken(['lawyer']), (req, res) =>
  availabilityController.getAllRuls(req, res)
);

router.delete("/schedule/delete/:ruleId",verifyToken(['lawyer']),  (req, res) =>
  availabilityController.DeleteRule(req, res)
);



router.get('/profile',verifyToken(['lawyer']), (req, res) => getProfileController.getDetils(req, res))


router.put('/profile/update', verifyToken(['lawyer']),upload.single('profileImage'), (req, res) => getProfileController.updateProfile(req,res))

export default router;

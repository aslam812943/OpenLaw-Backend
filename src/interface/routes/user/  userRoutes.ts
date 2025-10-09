import express from "express";
import { AuthController } from "../../controllers/user/AuthController";
import { RegisterUserUsecase } from "../../../application/user/auth/RegisterUserUsecase";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { RedisCacheService } from "../../../infrastructure/services/otp/RedisCacheService";
import { VerifyOtpUseCase } from "../../../application/user/auth/VerifyOtpUseCase";
import { NodeMailerEmailService } from "../../../infrastructure/services/nodeMailer/NodeMailerEmailService";
import { GenerateOtpUseCase } from "../../../application/user/auth/GenerateOtpUseCase";
import { OtpService } from "../../../infrastructure/services/otp/OtpService";
import { LoginUserUsecase } from "../../../application/user/auth/LoginUserUsecase";
import { ResendOtpUseCase } from "../../../application/user/auth/ResendOtpUseCase";


const router = express.Router();
const cacheService = new RedisCacheService()
const otpService = new OtpService(cacheService)
const generateOtpUseCase = new GenerateOtpUseCase(otpService)
const mailService = new NodeMailerEmailService()
const userRepository = new UserRepository();
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository,otpService)
const registerUserUsecase = new RegisterUserUsecase(userRepository,generateOtpUseCase,mailService);
const loginUserUsecase = new LoginUserUsecase(userRepository);
const resendOtpUseCase = new ResendOtpUseCase(cacheService, otpService, mailService);
const authController = new AuthController(registerUserUsecase,verifyOtpUseCase,loginUserUsecase,resendOtpUseCase);


router.post("/register", (req, res) => authController.registerUser(req, res));
router.post('/verify-otp',(req,res)=>authController.verifyOtp(req,res))
router.post('/login',(req,res)=>authController.loginUser(req,res))
router.post("/resend-otp", (req, res) => authController.resendOtp(req, res));

export default router;

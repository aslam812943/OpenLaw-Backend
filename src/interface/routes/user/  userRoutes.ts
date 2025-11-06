import express from "express";
import { AuthController } from "../../controllers/user/AuthController";
import { RegisterUserUsecase } from "../../../application/useCases/user/auth/RegisterUserUsecase";
import { UserRepository } from "../../../infrastructure/repositories/user/UserRepository";
import { RedisCacheService } from "../../../infrastructure/services/otp/RedisCacheService";
import { VerifyOtpUseCase } from "../../../application/useCases/user/auth/VerifyOtpUseCase";
import { NodeMailerEmailService } from "../../../infrastructure/services/nodeMailer/NodeMailerEmailService";
import { GenerateOtpUseCase } from "../../../application/useCases/user/auth/GenerateOtpUseCase";
import { OtpService } from "../../../infrastructure/services/otp/OtpService";
import { LoginUserUsecase } from "../../../application/useCases/user/auth/LoginUserUsecase";
import { ResendOtpUseCase } from "../../../application/useCases/user/auth/ResendOtpUseCase";
import { RequestForgetPasswordUseCase } from "../../../application/useCases/user/auth/RequestForgetPasswordUseCase";
import { VerifyResetPasswordUseCase } from "../../../application/useCases/user/auth/VerifyResetPasswordUseCase";   
import { LoginResponseMapper } from "../../../application/mapper/user/LoignResponseMapper";


const router = express.Router();
const cacheService = new RedisCacheService()
const otpService = new OtpService(cacheService)
const generateOtpUseCase = new GenerateOtpUseCase(otpService)
const mailService = new NodeMailerEmailService()
const userRepository = new UserRepository();
const loginResponseMapper = new LoginResponseMapper
const requestForgetPasswordUseCase = new RequestForgetPasswordUseCase(userRepository,otpService,mailService)
const verifyResetPasswordUseCase = new VerifyResetPasswordUseCase(userRepository,otpService)
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository,otpService)
const registerUserUsecase = new RegisterUserUsecase(userRepository,generateOtpUseCase,mailService);
const loginUserUsecase = new LoginUserUsecase(userRepository,loginResponseMapper);
const resendOtpUseCase = new ResendOtpUseCase(cacheService, otpService, mailService);
const authController = new AuthController(registerUserUsecase,verifyOtpUseCase,loginUserUsecase,resendOtpUseCase,requestForgetPasswordUseCase,verifyResetPasswordUseCase);


router.post("/register", (req, res) => authController.registerUser(req, res));
router.post('/verify-otp',(req,res)=>authController.verifyOtp(req,res))
router.post('/login',(req,res)=>authController.loginUser(req,res))
router.post("/resend-otp", (req, res) => authController.resendOtp(req, res));
router.post('/forget-password',(req,res)=>authController.requestForgetPassword(req,res))
router.post('/reset-password',(req,res)=>authController.verifyResetPassword(req,res))
// router.post('/verifyDetils',(req,res)=>authController.verify(req,res))
export default router;

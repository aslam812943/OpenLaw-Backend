import express from 'express'
import { AdminAuthController } from '../../controllers/admin/AdminAuthController';
import { GetAllUsersController } from '../../controllers/admin/GetAllUsersController';
import { UserRepository } from '../../../infrastructure/repositories/user/UserRepository';
import { GetAllUsersUseCase } from '../../../application/useCases/Admin/GetAllUsersUseCase';
import { TokenService } from '../../../infrastructure/services/jwt/TokenService';
import {AdminRepository} from '../../../infrastructure/repositories/admin/AdminRepository'
import { LoginAdminUseCase } from '../../../application/useCases/Admin/LoginAdminUseCase';
const router  = express.Router();
const tokenService = new TokenService()
const adminRepo = new AdminRepository();
const loginUseCase = new LoginAdminUseCase(adminRepo,tokenService)
const controller = new AdminAuthController(loginUseCase)
const userRepo = new UserRepository()
const getAllUsersUseCase = new GetAllUsersUseCase(userRepo)
const getAllUsersController = new GetAllUsersController(getAllUsersUseCase)

router.post('/login',(req,res)=>controller.login(req,res))
router.get('/users',(req,res)=>getAllUsersController.handle(req,res))
export default router
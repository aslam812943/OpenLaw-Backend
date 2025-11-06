import express from 'express'
import { AdminAuthController } from '../../controllers/admin/AdminAuthController';
import { GetAllUsersController } from '../../controllers/admin/GetAllUsersController';
import { UserRepository } from '../../../infrastructure/repositories/user/UserRepository';
import { GetAllUsersUseCase } from '../../../application/useCases/Admin/GetAllUsersUseCase';
const router  = express.Router();
const controller = new AdminAuthController()
const userRepo = new UserRepository()
const getAllUsersUseCase = new GetAllUsersUseCase(userRepo)
const getAllUsersController = new GetAllUsersController(getAllUsersUseCase)

router.post('/login',(req,res)=>controller.login(req,res))
router.get('/users',(req,res)=>getAllUsersController.handle(req,res))
export default router
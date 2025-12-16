"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAdminUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const NotFoundError_1 = require("../../../infrastructure/errors/NotFoundError");
const UnauthorizedError_1 = require("../../../infrastructure/errors/UnauthorizedError");
const AdminMapper_1 = require("../../mapper/admin/AdminMapper");
const Admin_1 = require("../../../domain/entities/Admin");
class LoginAdminUseCase {
    constructor(_adminRepository, _tokenService) {
        this._adminRepository = _adminRepository;
        this._tokenService = _tokenService;
    }
    async execute(data) {
        const admin = await this._adminRepository.findByEmail(data.email);
        if (!admin)
            throw new NotFoundError_1.NotFoundError('Admin not found');
        const ispasswordValid = await bcrypt_1.default.compare(data.password, admin.password);
        if (!ispasswordValid)
            throw new UnauthorizedError_1.UnauthorizedError('Invalid credentials');
        const token = this._tokenService.generateAccessToken(admin.id, 'admin', false);
        const refreshToken = this._tokenService.generateRefreshToken(admin.id, 'admin', false);
        return AdminMapper_1.AdminMapper.toLoginResponse(admin, token, refreshToken);
    }
    async createInitialAdmin() {
        const existing = await this._adminRepository.findByEmail("admin123@gmail.com");
        if (!existing) {
            const hashed = await bcrypt_1.default.hash("Admin@bct200", 10);
            const admin = new Admin_1.Admin(null, "Aslam", "admin123@gmail.com", hashed);
            await this._adminRepository.createAdmin(admin);
        }
        else {
            console.log(" Admin already exists");
        }
    }
}
exports.LoginAdminUseCase = LoginAdminUseCase;
//# sourceMappingURL=LoginAdminUseCase.js.map
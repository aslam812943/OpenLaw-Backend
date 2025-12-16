"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgetPasswordRequestDTO = void 0;
class ForgetPasswordRequestDTO {
    constructor(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email))
            throw new Error('Email is required');
        this.email = data.email;
    }
}
exports.ForgetPasswordRequestDTO = ForgetPasswordRequestDTO;
//# sourceMappingURL=ForgetPasswordRequestDTO.js.map
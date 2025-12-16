"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterDTO = void 0;
class UserRegisterDTO {
    constructor(data) {
        if (!data.name || data.name.length < 4) {
            throw new Error(" contain only letters, and be min 4 to  max 15 characters");
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!data.phone || !phoneRegex.test(data.phone.toString())) {
            throw new Error("Phone number must contain exactly 10 digits");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            throw new Error("A valid email address is required");
        }
        // const passwordRegex = /^.{8,16}$/
        // if (!data.password || !passwordRegex.test(data.password)) {
        //   throw new Error("Password must be 8–16 characters ");
        // }
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.password = data.password ?? '';
        this.isVerified = false;
        this.role = data.role || "user";
        this.isBlock = data.isBlock || false;
    }
}
exports.UserRegisterDTO = UserRegisterDTO;
//# sourceMappingURL=%20RegisterUserDTO.js.map
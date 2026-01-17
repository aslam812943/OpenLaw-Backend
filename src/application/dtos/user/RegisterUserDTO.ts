import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class UserRegisterDTO {
  name: string;
  email: string;
  phone: number;
  password?: string;
  isVerified?: boolean;
  role: string;
  isBlock: boolean;

  constructor(data: Partial<UserRegisterDTO>) {
    if (!data.name || data.name.length < 3 || data.name.length > 25) {
      throw new BadRequestError("Name must be between 3 and 25 characters");
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!data.phone || !phoneRegex.test(data.phone.toString())) {
      throw new BadRequestError("Phone number must contain exactly 10 digits");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      throw new BadRequestError("A valid email address is required");
    }

    this.name = data.name;
    this.email = data.email;
    this.phone = Number(data.phone);
    this.password = data.password ?? '';
    this.isVerified = false;
    this.role = data.role || "user";
    this.isBlock = data.isBlock || false;
  }
}

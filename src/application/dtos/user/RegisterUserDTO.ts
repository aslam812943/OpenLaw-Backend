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

    if (!data.password || data.password.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters long");
    }

    this.name = data.name;
    this.email = data.email;
    this.phone = Number(data.phone);
    this.password = data.password;
    this.isVerified = false;

    const allowedRoles = ["user", "lawyer"];
    if (data.role && !allowedRoles.includes(data.role)) {
      throw new BadRequestError(`Invalid role. Allowed roles are: ${allowedRoles.join(", ")}`);
    }
    this.role = data.role || "user";

    this.isBlock = false;
  }
}

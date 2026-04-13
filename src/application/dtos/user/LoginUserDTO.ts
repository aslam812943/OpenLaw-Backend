import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";

export class LoginUserDTO {
  email: string;
  password: string;

  constructor(data: Partial<LoginUserDTO>) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      throw new BadRequestError("A valid email address is required");
    }
    if (!data.password || data.password.trim() === '') {
      throw new BadRequestError("Password must be provided");
    }
    this.email = data.email;
    this.password = data.password;

  }
}
export class AdminLoginRequestDTO {
  email: string;
  password: string;

  constructor(data: Partial<AdminLoginRequestDTO>) {
    if (!data.email) throw new Error("Email is required");
    if (!data.password) throw new Error("Password is required");
    this.email = data.email;
    this.password = data.password;
  }
}

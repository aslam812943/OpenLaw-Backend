export default class LoginDTO {
  email: string;
  password: string;

  constructor(data: { email: string; password: string }) {
    this.email = data.email.trim();
    this.password = data.password.trim();
  }
}

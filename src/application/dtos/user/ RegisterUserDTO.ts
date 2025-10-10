export class UserRegisterDTO {
  name: string;
  email: string;
  phone: number;
  password: string;
  isVerified?: boolean;
  role: string;
  
  constructor(data: Partial<UserRegisterDTO>) {
  

    if (!data.name ) {
      console.log('name')
      throw new Error("Name must start with a capital letter, contain only letters, and be max 15 characters");
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!data.phone || !phoneRegex.test(data.phone.toString())) {
     
      throw new Error("Phone number must contain exactly 10 digits");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
   
      throw new Error("A valid email address is required");
    }

    const passwordRegex = /^.{8,16}$/
    if (!data.password || !passwordRegex.test(data.password)) {
      
      throw new Error("Password must be 8–16 characters ");
    }

    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.password = data.password;
    this.isVerified = false;
    this.role = data.role || "user";

  }
}

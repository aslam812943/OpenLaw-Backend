export class ForgetPasswordRequestDTO {
    email: string;


    constructor(data: Partial<ForgetPasswordRequestDTO>) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.email || !emailRegex.test(data.email)) throw new Error('Email is required')
        this.email = data.email;
    }
}
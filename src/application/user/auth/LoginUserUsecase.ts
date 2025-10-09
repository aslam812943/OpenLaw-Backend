import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { LoginUserDTO } from "../../dtos/user/LoginUserDTO";
import { User } from "../../../domain/entities/ User";





export class LoginUserUsecase {
    constructor(private _userRepo: IUserRepository) { }

    async execute(data: LoginUserDTO): Promise<{ token: string; user: User }> {
        const user = await this._userRepo.findByEmail(data.email);
        console.log('login user usecase')
        if (!user) throw new Error('No user found with this email');

        if (!user.isVerified) throw new Error('User email not verified');

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) throw new Error('Invalid password');


        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );



        return { token, user }
    }
}
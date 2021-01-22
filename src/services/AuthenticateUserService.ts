import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import authConfig from '../config/auth';
import { sign } from 'jsonwebtoken';

import User from '../models/User';


interface Request {
    email: string;
    password: string;
}

interface Response{
    user: User,
    token: string;
}
class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {

        const userRepository = getRepository(User);

        const user = await userRepository.findOne({ where: { email } });

        if(!user) {
            throw new Error("Email/Password Incorrect");
        }

        const passMatched = await compare(password, user.password);

        if(!passMatched){
            throw new Error("Email/Password Incorrect");
        }

        //nesse local é colocado as permissões do usuário
        const token = sign({}, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn,
        });

        return{
            user,
            token
        };

    }
}

export default AuthenticateUserService;
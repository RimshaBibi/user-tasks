import { Interfaces } from "../interfaces/userInterface";
import prisma from "../prismaclient";

export class UserRepository {


    async userExist(userEmail: string): Promise<Interfaces.IUserSignupReply | null> {
        const data = await prisma.users.findUnique({
            where: {
                email: userEmail
            }
        })
        //it means user exist
        if (data) {
            return data
        }
        return null;
    }
    async userCheck(user_id: string): Promise<Interfaces.IUserSignupReply | null> {
        const data = await prisma.users.findUnique({
            where: {
                user_id: user_id
            }
        })
        //it means user exist
        if (data) {
            return data
        }
        return null;
    }
    async signupUser(
        userName: string,
        userEmail: string,
        userPassword: string,
        salt: string,
    ): Promise<Interfaces.IUserSignupReply | null> {
        const status = 'pending_approval';
        const role = 'user'
        const data = await prisma.users.create({
            data: {
                name: userName,
                email: userEmail,
                user_password: userPassword,
                salt: salt,
                status: status,
                role: role
            }
        })
        return data || null
    }

    async signinUser(
        userEmail: string,
    ): Promise<Interfaces.ISignInReply | null> {
        const data = await prisma.users.findUnique({
            where: {
                email: userEmail
            }
        })
        return data || null
    }
}
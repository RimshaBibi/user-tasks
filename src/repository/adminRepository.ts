import { AInterfaces } from "../interfaces/adminInterface";
import { Interfaces } from "src/interfaces/userInterface";
import prisma from "../prismaclient";

export class AdminRepository {

    async adminSignUp(userName: string,
        userEmail: string,
        userPassword: string,
        salt: string,
    ): Promise<AInterfaces.IAdminSignupReply | null> {
        const status = 'active';
        const role = 'admin'
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

    async adminSignIn(
        userEmail: string,
    ): Promise<AInterfaces.IAdminSignInReply | null> {
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

    async checkUser(user_id: any): Promise<Interfaces.ISignInReply | null> {
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
    async checkEmail(userEmail: any): Promise<Interfaces.ISignInReply | null> {
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

    async updateUserStatus(status: string, user_id: string): Promise<string> {
        if (status === "active") {
            await prisma.users.update({
                where:
                    { user_id: user_id },
                data: {
                    status: "active"
                }
            })
        }
        else if (status === "blocked") {
            await prisma.users.update({
                where:
                    { user_id: user_id },
                data: {
                    status: "blocked"
                }
            })
        }
        else {
            return "User's Status does not updated. Status = pending_approval"
        }


        return `User's Status Updated Successfully. Staus = ${status}`
    }

    async deleteUser(user_id: string): Promise<string> {
        await prisma.users.delete({
            where: {
                user_id: user_id
            }
        })
        return "User Deleted Successfully"
    }
}
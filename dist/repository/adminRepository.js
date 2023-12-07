"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const prismaclient_1 = __importDefault(require("../prismaclient"));
class AdminRepository {
    async adminSignUp(userName, userEmail, userPassword, salt) {
        const status = 'active';
        const role = 'admin';
        const data = await prismaclient_1.default.users.create({
            data: {
                name: userName,
                email: userEmail,
                user_password: userPassword,
                salt: salt,
                status: status,
                role: role
            }
        });
        return data || null;
    }
    async adminSignIn(userEmail) {
        const data = await prismaclient_1.default.users.findUnique({
            where: {
                email: userEmail
            }
        });
        //it means user exist
        if (data) {
            return data;
        }
        return null;
    }
    async checkUser(user_id) {
        const data = await prismaclient_1.default.users.findUnique({
            where: {
                user_id: user_id
            }
        });
        //it means user exist
        if (data) {
            return data;
        }
        return null;
    }
    async checkEmail(userEmail) {
        const data = await prismaclient_1.default.users.findUnique({
            where: {
                email: userEmail
            }
        });
        //it means user exist
        if (data) {
            return data;
        }
        return null;
    }
    async updateUserStatus(status, user_id) {
        if (status === "active") {
            await prismaclient_1.default.users.update({
                where: { user_id: user_id },
                data: {
                    status: "active"
                }
            });
        }
        else if (status === "blocked") {
            await prismaclient_1.default.users.update({
                where: { user_id: user_id },
                data: {
                    status: "blocked"
                }
            });
        }
        else {
            return "User's Status does not updated. Status = pending_approval";
        }
        return `User's Status Updated Successfully. Staus = ${status}`;
    }
    async deleteUser(user_id) {
        await prismaclient_1.default.users.delete({
            where: {
                user_id: user_id
            }
        });
        return "User Deleted Successfully";
    }
}
exports.AdminRepository = AdminRepository;
//# sourceMappingURL=adminRepository.js.map
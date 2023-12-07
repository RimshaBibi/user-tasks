"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prismaclient_1 = __importDefault(require("../prismaclient"));
class UserRepository {
    async userExist(userEmail) {
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
    async userCheck(user_id) {
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
    async signupUser(userName, userEmail, userPassword, salt) {
        const status = 'pending_approval';
        const role = 'user';
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
    async signinUser(userEmail) {
        const data = await prismaclient_1.default.users.findUnique({
            where: {
                email: userEmail
            }
        });
        return data || null;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map
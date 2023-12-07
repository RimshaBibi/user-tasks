"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
class AdminController {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async noUserFound(user_id) {
        if (!await this.adminRepository.checkUser(user_id)) {
            return { message: "No User Exist" };
        }
        else {
            return null;
        }
    }
    async adminSignUp(request, reply) {
        const { userName, userEmail, userPassword } = request.body;
        if (!userName.trim()) {
            return reply.status(400).send({ "message": "User name is required" });
        }
        else if (userPassword.length < 8 || !userPassword.trim()) {
            return reply.status(400).send({ "message": "Password must contain at least 8 characters" });
        }
        else {
            const data = await this.adminRepository.checkEmail(userEmail.toLowerCase());
            if (data) {
                return reply.status(409).send({ "message": "Admin already exist" });
            }
            try {
                const salt = crypto_1.default.randomBytes(16).toString('hex');
                // Hash the salt and password with 1000 iterations, 64 length, and sha512 digest 
                const newPassword = crypto_1.default.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
                const user = await this.adminRepository.adminSignUp(userName, userEmail.toLowerCase(), newPassword, salt);
                const token = jsonwebtoken_1.default.sign({ admin_id: user === null || user === void 0 ? void 0 : user.user_id }, config_1.ADMIN_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                return reply.status(201).send(Object.assign(Object.assign({}, user), { token }));
            }
            catch (e) {
                return reply.status(500).send({ "message": "Internal Server Error" });
            }
        }
    }
    async adminSignIn(request, reply) {
        const { userEmail, userPassword } = request.body;
        const user = await this.adminRepository.adminSignIn(userEmail.toLowerCase());
        if (!userPassword.trim()) {
            return reply.status(400).send({ "message": "User password is required" });
        }
        else if (!user) {
            //user not exist 
            return reply.status(404).send({ "message": "User not exist" });
        }
        else {
            try {
                const storedHashedPassword = user.user_password;
                const salt = user.salt;
                const hashedPassword = crypto_1.default.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
                if (storedHashedPassword === hashedPassword) {
                    const token = jsonwebtoken_1.default.sign({ admin_id: user.user_id }, config_1.ADMIN_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                    return reply.status(200).send(Object.assign(Object.assign({}, user), { token }));
                }
                else {
                    //invalid credentials
                    return reply.status(401).send({ "message": "Enter valid credentials" });
                }
            }
            catch (e) {
                return reply.status(500).send({ "message": "Internal Server Error" });
            }
        }
    }
    async refresh(request, reply) {
        const { token } = request.body;
        if (!token.trim()) {
            return reply.status(400).send({ "message": 'Token is required' });
        }
        else {
            const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
            if (!decoded || typeof decoded !== 'object') {
                return reply.status(401).send({ "message": "Invalid token" });
            }
            request.admin = decoded.payload;
            const admin_id = request.admin.admin_id;
            const result = await this.noUserFound(admin_id);
            if (result !== null) {
                return reply.status(404).send({ message: "No Admin Exist" });
            }
            try {
                jsonwebtoken_1.default.verify(token, config_1.ADMIN_ACCESS_TOKEN_SECRET);
                return reply.status(200).send({ "message": "Token is not expired yet" });
            }
            catch (e) {
                if (e instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    console.log(request.user);
                    const newToken = jsonwebtoken_1.default.sign({ user_id: admin_id }, config_1.ADMIN_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                    return reply.status(201).send({ token: newToken });
                }
                else if (e instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    return reply.status(401).send({ "message": "Invalid token" });
                }
                return reply.status(500).send({ "message": "Internal Server Error" });
            }
        }
    }
    async updateUserStatus(request, reply) {
        const { id } = request.params;
        const { status } = request.body;
        const { admin_id } = request.admin;
        if (!request.params.id || request.params.id === ':id') {
            return reply.status(400).send({ "message": "User id is required in params" });
        }
        else {
            const result = await this.noUserFound(admin_id);
            if (result !== null) {
                return reply.status(404).send({ "message": "No Admin Exist" });
            }
            const userInfo = await this.noUserFound(id);
            if (userInfo !== null) {
                return reply.status(404).send(userInfo);
            }
            try {
                const data = await this.adminRepository.updateUserStatus(status, id);
                return reply.status(200).send({ "message": data });
            }
            catch (e) {
                return reply.status(500).send({ "message": "Internal Server Error" });
            }
        }
    }
    async deleteUser(request, reply) {
        const { id } = request.params;
        const { admin_id } = request.admin;
        if (!request.params.id || request.params.id === ':id') {
            return reply.status(400).send({ "message": "User id is required in params" });
        }
        else {
            const result = await this.noUserFound(admin_id);
            if (result !== null) {
                return reply.status(404).send({ "message": "No Admin Exist" });
            }
            const userInfo = await this.noUserFound(id);
            if (userInfo !== null) {
                return reply.status(404).send(userInfo);
            }
            try {
                const data = await this.adminRepository.deleteUser(id);
                return reply.status(200).send(JSON.stringify({ "message": data }));
            }
            catch (e) {
                return reply.status(500).send({ "message": "Internal Server Error" });
            }
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=adminController.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
class UserController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async signup(request, reply) {
        const { userName, userEmail, userPassword } = request.body;
        if (!userName.trim()) {
            return reply.status(400).send({ "message": "User name is required" });
        }
        else if (userPassword.length < 8 || !userPassword.trim()) {
            return reply.status(400).send({ "message": "Password must contain at least 8 characters" });
        }
        else if (await this.userRepository.userExist(userEmail.toLowerCase())) {
            return reply.status(409).send({ "message": "User already exist" });
        }
        else {
            try {
                const salt = crypto_1.default.randomBytes(16).toString('hex');
                // Hash the salt and password with 1000 iterations, 64 length, and sha512 digest 
                const newPassword = crypto_1.default.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
                const user_id = (0, uuid_1.v4)();
                const currentDate = new Date().toISOString().slice(0, 10);
                const user = await this.userRepository.signupUser(userName, userEmail.toLowerCase(), newPassword, salt, user_id, currentDate, currentDate);
                // console.log('User object:', user); 
                const token = jsonwebtoken_1.default.sign({ user_id: user === null || user === void 0 ? void 0 : user.user_id }, config_1.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                return reply.status(201).send(Object.assign(Object.assign({}, user), { token }));
            }
            catch (e) {
                reply.status(500).send({ "message": 'Internal Server Error' });
            }
        }
    }
    async signin(request, reply) {
        const { userEmail, userPassword } = request.body;
        const user = await this.userRepository.signinUser(userEmail.toLowerCase());
        if (!userPassword.trim()) {
            return reply.status(400).send({ "message": "User password is required" });
        }
        else if (!user) {
            //user not exist 
            return reply.status(404).send({ "message": "User not exist" });
        }
        try {
            const storedHashedPassword = user.user_password;
            // console.log(storedHashedPassword)
            const salt = user.salt;
            // console.log(salt)
            const hashedPassword = crypto_1.default.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
            if (storedHashedPassword === hashedPassword) {
                // console.log(user)
                const token = jsonwebtoken_1.default.sign({ user_id: user.user_id }, config_1.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                return reply.status(200).send(Object.assign(Object.assign({}, user), { token }));
            }
            else {
                //invalid credentials
                return reply.status(401).send({ "message": "Enter valid credentials" });
            }
        }
        catch (e) {
            reply.status(500).send({ "message": "Internal Server Error" });
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
            request.user = decoded.payload;
            const user_id = request.user.user_id;
            if (!await this.userRepository.userCheck(user_id)) {
                return reply.status(404).send({ "message": "No User Exist" });
            }
            try {
                jsonwebtoken_1.default.verify(token, config_1.ACCESS_TOKEN_SECRET);
                return reply.status(200).send({ "message": "Token is not expired yet" });
            }
            catch (e) {
                if (e instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    console.log(request.user);
                    const newToken = jsonwebtoken_1.default.sign({ user_id: user_id }, config_1.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                    return reply.status(201).send({ token: newToken });
                }
                else if (e instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    return reply.status(401).send({ "message": "Invalid token" });
                }
                return reply.status(500).send({ "message": "Internal Server Error" });
            }
        }
    }
}
exports.default = UserController;

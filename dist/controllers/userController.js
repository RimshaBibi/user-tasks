"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async signup(request, reply) {
        const { userName, userEmail, userPassword } = request.body;
        const info = await this.userRepository.userExist(userEmail);
        if (info !== null) {
            return reply.status(409).send("User already exist");
        }
        else {
            try {
                const salt = crypto_1.default.randomBytes(16).toString('hex');
                // Hash the salt and password with 1000 iterations, 64 length, and sha512 digest 
                const newPassword = crypto_1.default.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
                const user_id = (0, uuid_1.v4)();
                //  await EmailServices.sendEmail(userName,userEmail)
                const currentDate = new Date().toISOString().slice(0, 10);
                const user = await this.userRepository.signupUser(userName, userEmail, newPassword, salt, user_id, currentDate, currentDate);
                // console.log('User object:', user); 
                const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
                const token = jsonwebtoken_1.default.sign({ user_id: user === null || user === void 0 ? void 0 : user.user_id }, accessTokenSecret, { expiresIn: '15m' });
                return reply.status(201).send(Object.assign(Object.assign({}, user), { token }));
            }
            catch (e) {
                reply.status(500).send('Internal Server Error');
            }
        }
    }
    async signin(request, reply) {
        const { userEmail, userPassword } = request.body;
        const user = await this.userRepository.signinUser(userEmail);
        if (!user) {
            //user not exist 
            return reply.status(404).send("User not exist");
        }
        try {
            const storedHashedPassword = user.user_password;
            // console.log(storedHashedPassword)
            const salt = user.salt;
            // console.log(salt)
            const hashedPassword = crypto_1.default.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
            if (storedHashedPassword === hashedPassword) {
                // console.log(user)
                const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
                const token = jsonwebtoken_1.default.sign({ user_id: user.user_id }, accessTokenSecret, { expiresIn: '15m' });
                reply.status(200).send(Object.assign(Object.assign({}, user), { token }));
                return reply.status(200).send(user);
            }
            else {
                return reply.status(401).send("Wrong password");
            }
        }
        catch (e) {
            // console.error('Error during signin:', e);
            reply.status(500).send("Internal Server Error");
        }
    }
    async refresh(request, reply) {
        const { token, user_id, userEmail } = request.body;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!await this.userRepository.userExist(userEmail)) {
            return reply.status(404).send('No user Found');
        }
        else {
            try {
                jsonwebtoken_1.default.verify(token, accessTokenSecret);
            }
            catch (e) {
                if (e instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    const newToken = jsonwebtoken_1.default.sign({ user_id: user_id }, accessTokenSecret, { expiresIn: '15m' });
                    return reply.status(201).send({ token: newToken });
                }
                else if (e instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    return reply.status(401).send("Invalid token");
                }
                return reply.status(500).send("Internal Server Error");
            }
        }
    }
}
exports.default = UserController;

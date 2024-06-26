"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const emailController_js_1 = require("./emailController.js");
class UserController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async signup(request, reply) {
        const { userName, userEmail, userPassword } = request.body;
        const info = await this.userRepository.userExist(userEmail);
        if (info) {
            return info;
        }
        else {
            try {
                await emailController_js_1.EmailServices.sendEmail(userName, userEmail);
            }
            catch (e) {
                reply.status(500).send('Email sending failed');
            }
        }
        // const user=await this.userRepository.signupUser(userName,userEmail,userPassword);
        // if(!user)
        // {
        //     return reply.status(409).send("User already exist")
        // }
        // else{
        //     try{
        //          return reply.status(201).send(user)
        //     }
        //     catch(e){
        //       return  reply.status(500).send("Internal Server Error");
        //     }
        // }
    }
    async signin(request, reply) {
        const { userEmail, userPassword } = request.body;
        const user = await this.userRepository.signinUser(userEmail);
        if (!user) {
            return reply.status(404).send("User not exist");
        }
        try {
            const storedHashedPassword = user.user_password;
            // console.log(storedHashedPassword)
            const salt = user.salt;
            // console.log(salt)
            const hashedPassword = crypto_1.default.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
            if (storedHashedPassword == hashedPassword) {
                reply.status(200).send(user);
            }
            else {
                return reply.status(401).send("Wrong password");
            }
        }
        catch (e) {
            console.error('Error during signin:', e);
            reply.status(500).send("Internal Server Error");
        }
    }
}
exports.default = UserController;

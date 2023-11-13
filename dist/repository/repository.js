"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_js_1 = __importDefault(require("../database/database.js"));
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
class UserRepository {
    constructor(db) {
        this.db = db;
    }
    async userExist(userEmail) {
        const existingUser = await database_js_1.default.query("SELECT * FROM usertable WHERE email = $1", [userEmail]);
        //it means user exist
        if (existingUser.rows.length !== 0) {
            return "user exist";
        }
    }
    async signupUser(userName, userEmail, userPassword) {
        const salt = crypto_1.default.randomBytes(16).toString('hex');
        // Hash the salt and password with 1000 iterations, 64 length, and sha512 digest 
        let newPassword = crypto_1.default.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
        const user_id = (0, uuid_1.v4)();
        const data = await database_js_1.default.query('INSERT INTO usertable(user_id, name, email, user_password, salt) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user_id, userName, userEmail, newPassword, salt]);
        // console.log(data)
        return data.rows[0];
    }
    async signinUser(userEmail) {
        const data = await database_js_1.default.query("SELECT * FROM usertable WHERE email= $1", [userEmail]);
        // console.log(data.rows[0].email)
        return data.rows[0] || null;
    }
}
exports.UserRepository = UserRepository;

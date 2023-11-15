"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_js_1 = __importDefault(require("../database/database.js"));
class UserRepository {
    constructor(db) {
        this.db = db;
    }
    async userExist(userEmail) {
        const existingUser = await database_js_1.default.query("SELECT * FROM usertable WHERE email = $1", [userEmail]);
        //it means user exist
        if (existingUser.rows.length !== 0) {
            // return "user exist";
            return existingUser.rows[0];
        }
        else {
            return null;
        }
    }
    async signupUser(userName, userEmail, userPassword, salt, user_id) {
        const data = await database_js_1.default.query('INSERT INTO usertable(user_id, name, email, user_password, salt) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user_id, userName, userEmail, userPassword, salt]);
        // console.log(data.rows[0])
        return data.rows[0] || null;
    }
    async signinUser(userEmail) {
        const data = await database_js_1.default.query("SELECT * FROM usertable WHERE email= $1", [userEmail]);
        // console.log(data.rows[0])
        return data.rows[0] || null;
    }
}
exports.UserRepository = UserRepository;

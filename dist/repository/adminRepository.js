"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const database_1 = __importDefault(require("../database/database"));
class AdminRepository {
    constructor(db) {
        this.db = db;
    }
    async adminSignUp(userName, userEmail, userPassword, salt, user_id, createdDate, updatedDate) {
        const status = 'active';
        const role = 'admin';
        const data = await database_1.default.query('INSERT INTO users(user_id, name, email, user_password, salt , status, createdDate , updatedDate, role ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [user_id, userName, userEmail, userPassword, salt, status, createdDate, updatedDate, role]);
        console.log(data.rows[0]);
        return data.rows[0] || null;
    }
    async adminSignIn(userEmail) {
        const data = await database_1.default.query("SELECT * FROM users WHERE email= $1", [userEmail]);
        // console.log(data.rows[0])
        return data.rows[0] || null;
    }
    async checkUser(user_id) {
        const data = await database_1.default.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        //it means user exist
        if (data.rows.length !== 0) {
            return data.rows[0];
        }
        return null;
    }
    async updateUserStatus(status, user_id) {
        await database_1.default.query("UPDATE users SET status=$1 WHERE user_id=$2", [status, user_id]);
        return "User's Status Updated Successfully";
    }
    async deleteUser(user_id) {
        await database_1.default.query('DELETE from users WHERE user_id=$1', [user_id]);
        return "User Deleted Successfully";
    }
}
exports.AdminRepository = AdminRepository;

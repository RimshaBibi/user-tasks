import { Interfaces } from "../interfaces/userInterface";
import pool from "../database/database.js"
import { Pool } from "pg";

export class UserRepository {
    constructor(private db: Pool) { }

    async userExist(userEmail: string): Promise<Interfaces.IUserSignupReply | null> {
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail]);
        //it means user exist
        if (existingUser.rows.length !== 0) {
            // return "user exist";
            return existingUser.rows[0]
        }
        else {
            return null
        }
    }
    async userCheck(user_id: string): Promise<Interfaces.IUserSignupReply | null> {
        const existingUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        //it means user exist
        if (existingUser.rows.length !== 0) {
            // return "user exist";
            return existingUser.rows[0]
        }
        else {
            return null
        }
    }
    async signupUser(
        userName: string,
        userEmail: string,
        userPassword: string,
        salt: string,
        user_id: string,
        createdDate: string,
        updatedDate: string
    ): Promise<Interfaces.IUserSignupReply | null> {
        const status = 'pending-approval';
        const data = await pool.query('INSERT INTO users(user_id, name, email, user_password, salt , status, createdDate , updatedDate ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [user_id, userName, userEmail, userPassword, salt, status, createdDate, updatedDate]);
        // console.log(data.rows[0])
        return data.rows[0] || null;
    }

    async signinUser(
        userEmail: string,
    ): Promise<Interfaces.ISignInReply | null> {
        const data = await pool.query("SELECT * FROM users WHERE email= $1", [userEmail])
        // console.log(data.rows[0])
        return data.rows[0] || null;
    }
}
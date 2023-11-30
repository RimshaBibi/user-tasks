import { Pool } from "pg";
import pool from "../database/database";
import { AInterfaces } from "../interfaces/adminInterface";
import { Interfaces } from "src/interfaces/userInterface";

export class AdminRepository {
    constructor(private db: Pool) { }

    async adminSignUp(userName: string,
        userEmail: string,
        userPassword: string,
        salt: string,
        user_id: string,
        createdDate: string,
        updatedDate: string,
    ): Promise<AInterfaces.IAdminSignupReply | null> {
        const status = 'active';
        const role = 'admin'
        const data = await pool.query('INSERT INTO users(user_id, name, email, user_password, salt , status, createdDate , updatedDate, role ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [user_id, userName, userEmail, userPassword, salt, status, createdDate, updatedDate, role]);
        console.log(data.rows[0])
        return data.rows[0] || null;
    }

    async adminSignIn(
        userEmail: string,
    ): Promise<AInterfaces.IAdminSignInReply | null> {
        const data = await pool.query("SELECT * FROM users WHERE email= $1", [userEmail])
        // console.log(data.rows[0])
        return data.rows[0] || null;
    }

    async checkUser(user_id: any): Promise<Interfaces.ISignInReply | null> {
        const data = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        //it means user exist
        if (data.rows.length !== 0) {
            return data.rows[0]
        }
        return null;
    }

    async updateUserStatus(status: string, user_id: string): Promise<string> {
        await pool.query("UPDATE users SET status=$1 WHERE user_id=$2", [status, user_id])
        return "User's Status Updated Successfully"
    }

    async deleteUser(user_id: string): Promise<string> {
        await pool.query('DELETE from users WHERE user_id=$1', [user_id])
        return "User Deleted Successfully"
    }
}
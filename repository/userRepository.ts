import {Interfaces} from "../models/userModel.js";
import pool from "../database/database.js"
import { Pool } from "pg";
import crypto from "crypto"
import { v4 as uuid } from 'uuid';

export class UserRepository{
    constructor(private db: Pool) {}

   async userExist( userEmail:string){
    const existingUser = await pool.query("SELECT * FROM usertable WHERE email = $1", [userEmail]);
    //it means user exist
    if(existingUser.rows.length!==0)
    { 
        return "user exist";
    }
   }
    async signupUser(
        userName:string,
        userEmail:string,
        userPassword:string,
        salt:string,
        user_id:string
    )
    :Promise<Interfaces.IUserSignupReply|null >
    {
            const data = await pool.query('INSERT INTO usertable(user_id, name, email, user_password, salt) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user_id, userName, userEmail, userPassword, salt]);
            console.log(data.rows[0])
            return  data.rows[0] || null;
    }
    
    async signinUser(
        userEmail:string,
    ):Promise<Interfaces.ISignInReply|null >{
        const data= await pool.query("SELECT * FROM usertable WHERE email= $1",[userEmail])
        // console.log(data.rows[0])
        return data.rows[0] ||null;
    }
}
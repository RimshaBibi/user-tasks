import { Pool } from "pg";
import pool from "../database/database.js"
import { TaskInterface } from "models/taskModel";
import { Interfaces } from "models/userModel.js";


export class TaskRepository{

    constructor(private db:Pool){}
    async userExist( user_id:any):Promise<Interfaces.ISignInReply|null >{
    const data = await pool.query("SELECT * FROM usertable WHERE user_id = $1", [user_id]);
    //it means user exist
    if(data.rows.length!==0){
        return  data.rows[0]
    }
    return null;
   }
///////////////////////////add task////////////////////////////////////
    async addTask(
    task_id:string,
    title:string,
    description:string,
    user_id:string):Promise<TaskInterface.ITaskRep|null>
    {
        // console.log(user.rows[0])
        const data=await pool.query('INSERT INTO usertasks(task_id,title,description,user_id) VALUES ($1, $2, $3, $4) Returning *',[task_id, title, description, user_id]);
    //    console.log( data.rows[0] )
        return data.rows[0] || null
    }

    //////////////////////////get all tasks///////////////////////////////////////////
    async getAllTasks():Promise<TaskInterface.ITaskRep[]|null>{
        const data=await pool.query('SELECT * FROM usertasks');
        // console.log(data.rows)
        return data.rows || null
    }
  ///////////////////////////// Get single task//////////////////////////
    async getOneTask(task_id:string):Promise<TaskInterface.ITaskRep|null>{
    const data=await pool.query('SELECT * FROM usertasks where task_id = $1',[task_id])
    return data.rows[0] || null
  }
    ///////////////////////// update the task ///////////////////////////////////

    async checkTask(task_id:string):Promise<TaskInterface.ITaskRep|null>{
    const data=await pool.query('SELECT * FROM usertasks WHERE task_id = $1',[task_id])

    if(data.rows.length!==0){
        // console.log(data.rows[0] )
        return data.rows[0] 
    }
    return null;

    }

    async updateTask(
    task_id:string,
    title:string,
    description:string,
    ):Promise<TaskInterface.ITaskRep|null>
    {
    const data=await pool.query('UPDATE usertasks SET title = $1, description = $2 WHERE task_id = $3 RETURNING *',[title, description, task_id]);
    return data.rows[0] || null
    }

    ////////////////////////delete the task///////////////////////////////
    async deleteTask(
    task_id:string,
   ):Promise<string>
    {
    await pool.query('DELETE FROM usertasks WHERE task_id = $1 ', [task_id]);
    return "Task deleted successfully"
    }

    async userTasks(user_id:string):Promise<TaskInterface.ITaskRep[]|null>{
    const data=await pool.query('SELECT * FROM usertasks WHERE user_id = $1',[user_id])
    if(data.rows.length!==0){
        return data.rows
    }
    return null;
    }
    
}
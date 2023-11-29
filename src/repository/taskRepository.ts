import { Pool } from "pg";
import pool from "../database/database.js"
import { TaskInterface } from "../interfaces/taskInterface.js";
import { Interfaces } from "../interfaces/userInterface.js";


export class TaskRepository {

    constructor(private db: Pool) { }
    async userExist(user_id: any): Promise<Interfaces.ISignInReply | null> {
        const data = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        //it means user exist
        if (data.rows.length !== 0) {
            return data.rows[0]
        }
        return null;
    }
    ///////////////////////////add task////////////////////////////////////
    async addTask(
        task_id: string,
        title: string,
        description: string,
        user_id: string,
        createdDate: string): Promise<TaskInterface.ITaskRep | null> {
        // console.log(user.rows[0])
        const data = await pool.query('INSERT INTO tasks(task_id,title,description,user_id,createdDate,updatedDate) VALUES ($1, $2, $3, $4, $5, $6) Returning *', [task_id, title, description, user_id, createdDate, createdDate]);
        //    console.log( data.rows[0] )
        return data.rows[0] || null
    }
    //////////////////////////add files in the task ///////////////////////////
    async addFiles(file: Buffer, file_name: string, file_type: string, file_path: string, task_id: string): Promise<TaskInterface.ITaskFileAddRep | null> {
        const data = await pool.query('UPDATE tasks SET file = $1, filename = $2, file_type =$3,  file_path = $4 WHERE task_id = $5 RETURNING *', [file, file_name, file_type, file_path, task_id])
        // console.log(data.rows[0])
        return data.rows[0] || null
    }

    //////////////////////////get files of the task ///////////////////////////
    async getFiles(task_id: string): Promise<TaskInterface.ITaskFileRep | null> {
        const data = await pool.query('SELECT user_id, file, filename, file_type FROM tasks WHERE task_id  = $1', [task_id])
        if (!data) {
            return null
        }
        return data.rows[0]
    }

    //////////////////////////delete files of the task ///////////////////////////
    async deleteFiles(task_id: string): Promise<string> {
        await pool.query('UPDATE tasks SET file =NULL, filename =NULL, file_type=NULL ,file_path=NULL WHERE task_id =$1', [task_id])
        return "Tasks file deleted successfully"
    }
    //////////////////////////get all tasks///////////////////////////////////////////
    // page the number of the page and size is how much data is shown 
    async getAllTasks(page: number, size: number): Promise<TaskInterface.ITaskRep[] | null> {
        //offset means how much data is skip
        // console.log(page)
        // console.log(size)
        const offset = (page - 1) * size;
        const data = await pool.query('SELECT task_id, title, description, user_id, filename, file_type, createdDate, updatedDate  FROM tasks ORDER BY updatedDate LIMIT $1 OFFSET $2', [size, offset]);
        // console.log(data.rows)
        if (data.rows.length !== 0) {
            return data.rows
        }
        return null;
    }
    ///////////////////////////// Get single task//////////////////////////
    async getOneTask(task_id: string): Promise<TaskInterface.ITaskRep | null> {
        const data = await pool.query('SELECT * FROM tasks where task_id = $1', [task_id])
        if (!data) {
            return null
        }
        return data.rows[0]
    }


    ///////////////////////// get one user task ///////////////////////////////////
    async userTasks(user_id: string, page: number, size: number): Promise<TaskInterface.ITaskRep[] | null> {
        const offset = (page - 1) * size;
        const data = await pool.query('SELECT task_id, title, description, user_id, filename, file_type, createdDate, updatedDate FROM tasks WHERE user_id = $1 ORDER BY updatedDate LIMIT $2 OFFSET $3 ', [user_id, size, offset])
        if (data.rows.length !== 0) {
            return data.rows
        }
        return null;
    }


    ///////////////////////// update the task ///////////////////////////////////
    async updateTask(
        task_id: string,
        title: string,
        description: string,
        currentDate: string,
    ): Promise<TaskInterface.ITaskRep | null> {
        const data = await pool.query('UPDATE tasks SET title = $1, description = $2, updateddate = $3 WHERE task_id = $4 RETURNING *', [title, description, currentDate, task_id,]);
        return data.rows[0] || null
    }

    ////////////////////////delete the task///////////////////////////////
    async deleteTask(
        task_id: string,
    ): Promise<string> {
        await pool.query('DELETE FROM tasks WHERE task_id = $1 ', [task_id]);
        return "Task deleted successfully"
    }



}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const database_js_1 = __importDefault(require("../database/database.js"));
class TaskRepository {
    constructor(db) {
        this.db = db;
    }
    async userExist(user_id) {
        const data = await database_js_1.default.query("SELECT * FROM usertable WHERE user_id = $1", [user_id]);
        //it means user exist
        if (data.rows.length !== 0) {
            return data.rows[0];
        }
        return null;
    }
    ///////////////////////////add task////////////////////////////////////
    async addTask(task_id, title, description, user_id, createdDate) {
        // console.log(user.rows[0])
        const data = await database_js_1.default.query('INSERT INTO usertasks(task_id,title,description,user_id,createdDate,updatedDate) VALUES ($1, $2, $3, $4, $5, $6) Returning *', [task_id, title, description, user_id, createdDate, createdDate]);
        //    console.log( data.rows[0] )
        return data.rows[0] || null;
    }
    //////////////////////////get all tasks///////////////////////////////////////////
    // page the number of the page and size is how much data is shown 
    async getAllTasks(page, size) {
        //offset means how much data is skip
        const offset = (page - 1) * size;
        const data = await database_js_1.default.query('SELECT * FROM usertasks ORDER BY updatedDate LIMIT $1 OFFSET $2', [size, offset]);
        // console.log(data.rows)
        return data.rows || null;
    }
    ///////////////////////////// Get single task//////////////////////////
    async getOneTask(task_id) {
        const data = await database_js_1.default.query('SELECT * FROM usertasks where task_id = $1', [task_id]);
        return data.rows[0] || null;
    }
    ///////////////////////// get one user task ///////////////////////////////////
    async userTasks(user_id, page, size) {
        const offset = (page - 1) * size;
        const data = await database_js_1.default.query('SELECT * FROM usertasks WHERE user_id = $1 ORDER BY updatedDate LIMIT $2 OFFSET $3 ', [user_id, size, offset]);
        if (data.rows.length !== 0) {
            return data.rows;
        }
        return null;
    }
    ///////////////////////// update the task ///////////////////////////////////
    async checkTask(task_id) {
        const data = await database_js_1.default.query('SELECT * FROM usertasks WHERE task_id = $1', [task_id]);
        if (data.rows.length !== 0) {
            // console.log(data.rows[0] )
            return data.rows[0];
        }
        return null;
    }
    async updateTask(task_id, title, description, currentDate) {
        const data = await database_js_1.default.query('UPDATE usertasks SET title = $1, description = $2, updateddate = $3 WHERE task_id = $4 RETURNING *', [title, description, currentDate, task_id,]);
        return data.rows[0] || null;
    }
    ////////////////////////delete the task///////////////////////////////
    async deleteTask(task_id) {
        await database_js_1.default.query('DELETE FROM usertasks WHERE task_id = $1 ', [task_id]);
        return "Task deleted successfully";
    }
}
exports.TaskRepository = TaskRepository;
